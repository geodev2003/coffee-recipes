const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer to use memory storage (for Cloudinary)
const storage = multer.memoryStorage();

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

// Upload handler - upload to Cloudinary
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'No file uploaded' 
            });
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer, 'coffee-recipes');

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            url: result.secure_url, // Cloudinary secure URL
            public_id: result.public_id, // For future deletion if needed
            filename: result.original_filename
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading file to Cloudinary',
            error: error.message
        });
    }
};

// Upload multiple images - upload to Cloudinary
exports.uploadImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'No files uploaded' 
            });
        }

        // Upload all files to Cloudinary in parallel
        const uploadPromises = req.files.map(file => 
            uploadToCloudinary(file.buffer, 'coffee-recipes')
        );

        const results = await Promise.all(uploadPromises);

        const fileUrls = results.map(result => ({
            url: result.secure_url,
            public_id: result.public_id,
            filename: result.original_filename
        }));

        res.status(200).json({
            success: true,
            message: 'Files uploaded successfully',
            files: fileUrls
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading files to Cloudinary',
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

