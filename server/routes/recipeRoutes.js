const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', recipeController.getRecipes);
router.get('/:id/related', recipeController.getRelatedRecipes);
router.get('/:id', recipeController.getRecipeById);

// Protected admin routes
router.post('/', protect, adminOnly, recipeController.createRecipe);
router.put('/:id', protect, adminOnly, recipeController.updateRecipe);
router.delete('/:id', protect, adminOnly, recipeController.deleteRecipe);

module.exports = router;
