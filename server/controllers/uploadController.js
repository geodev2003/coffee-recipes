const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');

// Check if Cloudinary is configured
const isCloudinaryConfigured = 
    process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET;

// Conditionally require and configure Cloudinary
let cloudinary = null;
if (isCloudinaryConfigured) {
    try {
        cloudinary = require('cloudinary').v2;
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        console.log('✅ Cloudinary configured successfully');
    } catch (error) {
        console.warn('⚠️  Cloudinary package not installed. Using local storage fallback.');
        console.warn('   Install with: npm install cloudinary');
        cloudinary = null;
    }
} else {
    console.warn('⚠️  Cloudinary not configured. Using local storage fallback.');
}

// Ensure uploads directory exists for local storage
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage based on Cloudinary availability
let storage;
if (isCloudinaryConfigured && cloudinary) {
    // Use memory storage for Cloudinary
    storage = multer.memoryStorage();
} else {
    // Use disk storage for local fallback
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadsDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            const name = path.basename(file.originalname, ext);
            cb(null, `${name}-${uniqueSuffix}${ext}`);
        }
    });
}

// File filter - only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed!'));
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});

// Single file upload
exports.uploadSingle = upload.single('image');

// Multiple files upload
exports.uploadMultiple = upload.array('images', 10); // Max 10 images

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder = 'coffee-recipes') => {
    if (!cloudinary) {
        throw new Error('Cloudinary is not available');
    }
    
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'image',
                transformation: [
                    { quality: 'auto' },
                    { fetch_format: 'auto' }
                ]
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        // Convert buffer to stream
        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
    });
};

// Upload handler - upload to Cloudinary or local storage
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'No file uploaded' 
            });
        }

        // Log upload attempt
        console.log('Upload attempt - Cloudinary configured:', isCloudinaryConfigured, 'Cloudinary available:', !!cloudinary);

        // Try Cloudinary first if configured and available
        if (isCloudinaryConfigured && cloudinary) {
            try {
                console.log('Attempting to upload to Cloudinary...');
                const result = await uploadToCloudinary(req.file.buffer, 'coffee-recipes');
                console.log('✅ Successfully uploaded to Cloudinary:', result.secure_url);
                return res.status(200).json({
                    success: true,
                    message: 'File uploaded successfully to Cloudinary',
                    url: result.secure_url,
                    public_id: result.public_id,
                    filename: result.original_filename
                });
            } catch (cloudinaryError) {
                console.error('❌ Cloudinary upload error:', cloudinaryError);
                console.error('Error details:', cloudinaryError.message);
                // Fallback to local storage if Cloudinary fails
                console.log('⚠️ Falling back to local storage...');
            }
        } else {
            console.log('⚠️ Cloudinary not configured or not available. Using local storage.');
            if (!isCloudinaryConfigured) {
                console.log('   Missing environment variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
            }
            if (!cloudinary) {
                console.log('   Cloudinary package not loaded');
            }
        }

        // Fallback to local storage
        console.log('📁 Saving to local storage...');
        if (!req.file.filename) {
            // If using memory storage but Cloudinary failed, save to disk
            const uploadsDir = path.join(__dirname, '../uploads');
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(req.file.originalname);
            const name = path.basename(req.file.originalname, ext);
            const filename = `${name}-${uniqueSuffix}${ext}`;
            const filepath = path.join(uploadsDir, filename);
            
            // Ensure directory exists
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }
            
            fs.writeFileSync(filepath, req.file.buffer);
            
            // Construct full URL from Railway server
            // Get the origin from request or use environment variable
            const serverUrl = process.env.SERVER_URL || 
                             (req.protocol + '://' + req.get('host')) ||
                             'https://insightful-dream-production.up.railway.app';
            const fileUrl = `${serverUrl}/uploads/${filename}`;
            
            console.log('✅ Saved to local storage:', fileUrl);
            return res.status(200).json({
                success: true,
                message: 'File uploaded successfully to local storage (Cloudinary not configured)',
                url: fileUrl, // Return full URL
                filename: filename,
                storage: 'local'
            });
        }

        // If already saved to disk (diskStorage)
        // Construct full URL from Railway server
        const serverUrl = process.env.SERVER_URL || 
                         (req.protocol + '://' + req.get('host')) ||
                         'https://insightful-dream-production.up.railway.app';
        const fileUrl = `${serverUrl}/uploads/${req.file.filename}`;
        console.log('✅ Saved to local storage (disk):', fileUrl);
        res.status(200).json({
            success: true,
            message: 'File uploaded successfully to local storage',
            url: fileUrl, // Return full URL
            filename: req.file.filename,
            storage: 'local'
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading file',
            error: error.message
        });
    }
};

// Upload multiple images - upload to Cloudinary or local storage
exports.uploadImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'No files uploaded' 
            });
        }

        // Try Cloudinary first if configured and available
        if (isCloudinaryConfigured && cloudinary) {
            try {
                const uploadPromises = req.files.map(file => 
                    uploadToCloudinary(file.buffer, 'coffee-recipes')
                );
                const results = await Promise.all(uploadPromises);
                const fileUrls = results.map(result => ({
                    url: result.secure_url,
                    public_id: result.public_id,
                    filename: result.original_filename
                }));
                return res.status(200).json({
                    success: true,
                    message: 'Files uploaded successfully to Cloudinary',
                    files: fileUrls
                });
            } catch (cloudinaryError) {
                console.error('Cloudinary upload error:', cloudinaryError);
                console.log('Falling back to local storage...');
            }
        }

        // Fallback to local storage
        const uploadsDir = path.join(__dirname, '../uploads');
        const fileUrls = [];
        
        // Construct full URL from Railway server
        const serverUrl = process.env.SERVER_URL || 
                         (req.protocol + '://' + req.get('host')) ||
                         'https://insightful-dream-production.up.railway.app';
        
        for (const file of req.files) {
            let filename;
            if (file.filename) {
                // Already saved to disk
                filename = file.filename;
            } else {
                // Save from buffer
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = path.extname(file.originalname);
                const name = path.basename(file.originalname, ext);
                filename = `${name}-${uniqueSuffix}${ext}`;
                const filepath = path.join(uploadsDir, filename);
                fs.writeFileSync(filepath, file.buffer);
            }
            
            // Return full URL from Railway server
            fileUrls.push({
                url: `${serverUrl}/uploads/${filename}`,
                filename: filename
            });
        }

        res.status(200).json({
            success: true,
            message: 'Files uploaded successfully to local storage',
            files: fileUrls
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading files',
            error: error.message
        });
    }
};

// Optional: Delete image from Cloudinary
exports.deleteImage = async (req, res) => {
    try {
        if (!cloudinary) {
            return res.status(400).json({
                success: false,
                message: 'Cloudinary is not configured'
            });
        }

        const { public_id } = req.body;
        
        if (!public_id) {
            return res.status(400).json({
                success: false,
                message: 'Public ID is required'
            });
        }

        const result = await cloudinary.uploader.destroy(public_id);

        res.status(200).json({
            success: true,
            message: 'Image deleted successfully',
            result: result
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting image from Cloudinary',
            error: error.message
        });
    }
};

