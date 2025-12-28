const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

// All wishlist routes require authentication
router.use(protect);

router.get('/', wishlistController.getWishlist);
router.post('/:recipeId', wishlistController.addToWishlist);
router.delete('/:recipeId', wishlistController.removeFromWishlist);
router.get('/check/:recipeId', wishlistController.checkWishlist);

module.exports = router;

