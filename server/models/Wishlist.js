const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  }
}, { timestamps: true });

// Ensure one recipe per user (no duplicates)
wishlistSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);

