const mongoose = require('mongoose');

// Ingredient schema as an object
const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: String, required: true },
  unit: { type: String, default: '' }
}, { _id: false });

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { 
    type: String, 
    required: false, // Will be auto-generated in pre-save hook
    unique: true,
    lowercase: true,
    trim: true
  },
  description: { type: String, required: true },
  ingredients: [ingredientSchema],
  instructions: [{ type: String, required: true }],
  prepTime: { type: Number, required: true },
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'], 
    default: 'Medium' 
  },
  image: { type: String }, // Keep for backward compatibility
  images: [{ type: String }], // Array of image URLs
  category: { 
    type: String, 
    enum: ['Coffee', 'Tea', 'Mocktail'], 
    required: true 
  },
  calories: { type: Number },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
}, { timestamps: true });

// Generate slug from title before saving
recipeSchema.pre('save', function() {
  // Always generate slug if it doesn't exist or if title is modified
  if (!this.slug || this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Ensure slug is not empty
    if (!this.slug) {
      this.slug = 'recipe-' + Date.now();
    }
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);
