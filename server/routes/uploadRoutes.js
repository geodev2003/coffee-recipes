const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');

// Try to require uploadController, with error handling
let uploadController;
try {
    uploadController = require('../controllers/uploadController');
} catch (error) {
    console.error('Error loading uploadController:', error);
    // Create fallback handlers
    uploadController = {
        uploadSingle: (req, res, next) => next(),
        uploadMultiple: (req, res, next) => next(),
        uploadImage: (req, res) => res.status(500).json({ success: false, message: 'Upload controller not available' }),
        uploadImages: (req, res) => res.status(500).json({ success: false, message: 'Upload controller not available' }),
        deleteImage: (req, res) => res.status(500).json({ success: false, message: 'Upload controller not available' })
    };
}

const { uploadSingle, uploadMultiple, uploadImage, uploadImages, deleteImage } = uploadController;

// Upload single image (protected, admin only)
router.post('/single', protect, adminOnly, uploadSingle, uploadImage);

// Upload multiple images (protected, admin only)
router.post('/multiple', protect, adminOnly, uploadMultiple, uploadImages);

// Delete image from Cloudinary (protected, admin only)
router.delete('/', protect, adminOnly, deleteImage);

module.exports = router;

