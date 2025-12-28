const Wishlist = require('../models/Wishlist');
const Recipe = require('../models/Recipe');

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find({ userId: req.user._id })
      .populate('recipeId')
      .sort({ createdAt: -1 });

    const recipes = wishlistItems.map(item => item.recipeId).filter(Boolean);

    res.status(200).json({
      success: true,
      count: recipes.length,
      recipes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { recipeId } = req.params;

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if already in wishlist
    const existing = await Wishlist.findOne({
      userId: req.user._id,
      recipeId
    });

    if (existing) {
      return res.status(400).json({ message: 'Recipe already in wishlist' });
    }

    // Add to wishlist
    const wishlistItem = await Wishlist.create({
      userId: req.user._id,
      recipeId
    });

    res.status(201).json({
      success: true,
      message: 'Recipe added to wishlist',
      wishlistItem
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Recipe already in wishlist' });
    }
    res.status(500).json({ message: error.message });
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const wishlistItem = await Wishlist.findOneAndDelete({
      userId: req.user._id,
      recipeId
    });

    if (!wishlistItem) {
      return res.status(404).json({ message: 'Recipe not found in wishlist' });
    }

    res.status(200).json({
      success: true,
      message: 'Recipe removed from wishlist'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if recipe is in wishlist
exports.checkWishlist = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const wishlistItem = await Wishlist.findOne({
      userId: req.user._id,
      recipeId
    });

    res.status(200).json({
      success: true,
      inWishlist: !!wishlistItem
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

