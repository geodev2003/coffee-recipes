const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const { protect, adminOnly } = require('../middleware/auth');

// Protected admin routes
router.get('/dashboard', protect, adminOnly, statisticsController.getDashboardStats);

// Public tracking routes (no auth needed)
router.post('/view/:recipeId', statisticsController.trackView);
router.post('/visitor', statisticsController.trackVisitor);

module.exports = router;

