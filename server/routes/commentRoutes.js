const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

// Public route - get comments
router.get('/recipe/:recipeId', commentController.getComments);

// Protected routes - require authentication
router.post('/recipe/:recipeId', protect, commentController.createComment);
router.put('/:commentId', protect, commentController.updateComment);
router.delete('/:commentId', protect, commentController.deleteComment);
router.post('/:commentId/like', protect, commentController.toggleLike);
router.post('/:commentId/reply', protect, commentController.addReply);

module.exports = router;

