const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { uploadSingle, uploadMultiple, uploadImage, uploadImages } = require('../controllers/uploadController');

// Upload single image (protected, admin only)
router.post('/single', protect, adminOnly, uploadSingle, uploadImage);

// Upload multiple images (protected, admin only)
router.post('/multiple', protect, adminOnly, uploadMultiple, uploadImages);

module.exports = router;

