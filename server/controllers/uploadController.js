const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

// Check if Cloudinary is configured
const isCloudinaryConfigured = 
    process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET;

// Configure Cloudinary if credentials are available
if (isCloudinaryConfigured) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    console.log('✅ Cloudinary configured successfully');
} else {
    console.warn('⚠️  Cloudinary not configured. Using local storage fallback.');
    // Fallback to local storage
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
}

// Configure multer storage based on Cloudinary availability
let storage;
if (isCloudinaryConfigured) {
    // Use memory storage for Cloudinary
    storage = multer.memoryStorage();
} else {
    // Use disk storage for local fallback
    const uploadsDir = path.join(__dirname, '../uploads');
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

        // Try Cloudinary first if configured
        if (isCloudinaryConfigured) {
            try {
                const result = await uploadToCloudinary(req.file.buffer, 'coffee-recipes');
                return res.status(200).json({
                    success: true,
                    message: 'File uploaded successfully to Cloudinary',
                    url: result.secure_url,
                    public_id: result.public_id,
                    filename: result.original_filename
                });
            } catch (cloudinaryError) {
                console.error('Cloudinary upload error:', cloudinaryError);
                // Fallback to local storage if Cloudinary fails
                console.log('Falling back to local storage...');
            }
        }

        // Fallback to local storage
        if (!req.file.filename) {
            // If using memory storage but Cloudinary failed, save to disk
            const uploadsDir = path.join(__dirname, '../uploads');
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(req.file.originalname);
            const name = path.basename(req.file.originalname, ext);
            const filename = `${name}-${uniqueSuffix}${ext}`;
            const filepath = path.join(uploadsDir, filename);
            
            fs.writeFileSync(filepath, req.file.buffer);
            const fileUrl = `/uploads/${filename}`;
            
            return res.status(200).json({
                success: true,
                message: 'File uploaded successfully to local storage',
                url: fileUrl,
                filename: filename
            });
        }

        // If already saved to disk (diskStorage)
        const fileUrl = `/uploads/${req.file.filename}`;
        res.status(200).json({
            success: true,
            message: 'File uploaded successfully to local storage',
            url: fileUrl,
            filename: req.file.filename
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

        // Try Cloudinary first if configured
        if (isCloudinaryConfigured) {
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
            
            fileUrls.push({
                url: `/uploads/${filename}`,
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

