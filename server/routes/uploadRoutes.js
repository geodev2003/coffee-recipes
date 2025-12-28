const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { uploadSingle, uploadMultiple, uploadImage, uploadImages, deleteImage } = require('../controllers/uploadController');

// Upload single image (protected, admin only)
router.post('/single', protect, adminOnly, uploadSingle, uploadImage);

// Upload multiple images (protected, admin only)
router.post('/multiple', protect, adminOnly, uploadMultiple, uploadImages);

// Delete image from Cloudinary (protected, admin only)
router.delete('/', protect, adminOnly, deleteImage);

module.exports = router;

