const Recipe = require('../models/Recipe');

// Get all recipes with search and filter
exports.getRecipes = async (req, res) => {
    try {
        const { 
            search, 
            category, 
            sort, 
            difficulty, 
            prepTime, 
            minRating,
            page = 1,
            limit = 12,
            featured
        } = req.query;
        
        let query = {};

        // Search filter
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Category filter
        if (category && category !== 'All') {
            query.category = category;
        }

        // Difficulty filter
        if (difficulty) {
            query.difficulty = { $regex: difficulty, $options: 'i' };
        }

        // Prep time filter
        if (prepTime) {
            if (prepTime === '0-15') {
                query.prepTime = { $lte: 15 };
            } else if (prepTime === '16-30') {
                query.prepTime = { $gte: 16, $lte: 30 };
            } else if (prepTime === '31+') {
                query.prepTime = { $gte: 31 };
            }
        }

        // Rating filter
        if (minRating) {
            query.rating = { $gte: parseFloat(minRating) };
        }

        // Featured filter
        if (featured === 'true') {
            query.rating = { ...query.rating, $gte: 4 };
        }

        // Sort options
        let sortOption = { createdAt: -1 };
        if (sort === 'popular') {
            sortOption = { rating: -1, reviewsCount: -1, createdAt: -1 };
        } else if (sort === 'newest') {
            sortOption = { createdAt: -1 };
        } else if (sort === 'oldest') {
            sortOption = { createdAt: 1 };
        } else if (sort === 'rating') {
            sortOption = { rating: -1, createdAt: -1 };
        } else if (sort === 'time') {
            sortOption = { prepTime: 1 };
        }

        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Get total count for pagination
        const total = await Recipe.countDocuments(query);

        // Get recipes
        const recipes = await Recipe.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum);

        res.status(200).json({
            recipes,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalRecipes: total,
                hasNextPage: pageNum < Math.ceil(total / limitNum),
                hasPrevPage: pageNum > 1
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single recipe
exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create recipe
exports.createRecipe = async (req, res) => {
    try {
        // Validate required fields
        const { title, description, category, prepTime, ingredients, instructions } = req.body;
        
        if (!title || !description || !category || !prepTime || !ingredients || !instructions) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                required: ['title', 'description', 'category', 'prepTime', 'ingredients', 'instructions']
            });
        }

        // Ensure ingredients is an array
        if (!Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({ 
                message: 'Ingredients must be a non-empty array',
                received: typeof ingredients
            });
        }

        // Validate each ingredient has required fields
        for (let i = 0; i < ingredients.length; i++) {
            const ing = ingredients[i];
            if (!ing.name || typeof ing.name !== 'string' || !ing.name.trim()) {
                return res.status(400).json({ 
                    message: `Ingredient ${i + 1} is missing a name` 
                });
            }
            if (ing.amount === undefined || ing.amount === null || ing.amount === '') {
                return res.status(400).json({ 
                    message: `Ingredient ${i + 1} (${ing.name}) is missing an amount` 
                });
            }
        }

        // Ensure instructions is an array
        if (!Array.isArray(instructions) || instructions.length === 0) {
            return res.status(400).json({ 
                message: 'Instructions must be a non-empty array' 
            });
        }

        // Prepare recipe data
        const recipeData = {
            title: title.trim(),
            description: description.trim(),
            category,
            prepTime: parseInt(prepTime),
            difficulty: req.body.difficulty || 'Medium',
            ingredients: ingredients.map(ing => ({
                name: ing.name.trim(),
                amount: String(ing.amount || '1'), // Ensure amount is a string
                unit: String(ing.unit || '')
            })),
            instructions: instructions.map(inst => inst.trim()).filter(inst => inst),
            calories: req.body.calories ? parseInt(req.body.calories) : undefined,
            // Store images array - can contain Cloudinary URLs or local URLs
            images: Array.isArray(req.body.images) 
                ? req.body.images.filter(img => img && img.trim()).map(img => img.trim())
                : (req.body.images ? [req.body.images.trim()].filter(img => img) : []),
            image: req.body.image || undefined, // Keep for backward compatibility
        };

        console.log('Creating recipe with data:', JSON.stringify(recipeData, null, 2));
        const newRecipe = new Recipe(recipeData);
        const savedRecipe = await newRecipe.save();
        res.status(201).json(savedRecipe);
    } catch (error) {
        console.error('Error creating recipe:', error);
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                message: 'Validation error',
                errors 
            });
        }
        // Handle duplicate slug error
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: 'A recipe with this title already exists' 
            });
        }
        res.status(400).json({ 
            message: error.message || 'Error creating recipe',
            error: error.toString()
        });
    }
};

// Update recipe
exports.updateRecipe = async (req, res) => {
    try {
        // Prepare update data similar to create
        const updateData = { ...req.body };
        
        // Handle images array - can contain Cloudinary URLs or local URLs
        if (updateData.images !== undefined) {
            if (Array.isArray(updateData.images)) {
                updateData.images = updateData.images.filter(img => img && img.trim()).map(img => img.trim());
            } else if (typeof updateData.images === 'string') {
                updateData.images = updateData.images.split('\n').filter(img => img.trim()).map(img => img.trim());
            }
        }
        
        // Handle ingredients if provided
        if (updateData.ingredients && Array.isArray(updateData.ingredients)) {
            updateData.ingredients = updateData.ingredients.map(ing => ({
                name: ing.name ? ing.name.trim() : '',
                amount: String(ing.amount || '1'),
                unit: String(ing.unit || '')
            }));
        }
        
        // Handle instructions if provided
        if (updateData.instructions && Array.isArray(updateData.instructions)) {
            updateData.instructions = updateData.instructions.map(inst => inst.trim()).filter(inst => inst);
        }
        
        // Handle numeric fields
        if (updateData.prepTime !== undefined) {
            updateData.prepTime = parseInt(updateData.prepTime);
        }
        if (updateData.calories !== undefined && updateData.calories !== null) {
            updateData.calories = parseInt(updateData.calories);
        }
        
        const updatedRecipe = await Recipe.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true }
        );
        
        if (!updatedRecipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        
        res.status(200).json(updatedRecipe);
    } catch (error) {
        console.error('Error updating recipe:', error);
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                message: 'Validation error',
                errors 
            });
        }
        res.status(400).json({ message: error.message || 'Error updating recipe' });
    }
};

// Delete recipe
exports.deleteRecipe = async (req, res) => {
    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!deletedRecipe) return res.status(404).json({ message: 'Recipe not found' });
        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get related recipes
exports.getRelatedRecipes = async (req, res) => {
    try {
        const { id } = req.params;
        const limit = parseInt(req.query.limit) || 4;

        // Get current recipe
        const currentRecipe = await Recipe.findById(id);
        if (!currentRecipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Find related recipes (same category, exclude current recipe)
        const relatedRecipes = await Recipe.find({
            category: currentRecipe.category,
            _id: { $ne: id }
        })
        .limit(limit)
        .sort({ rating: -1, createdAt: -1 });

        res.status(200).json(relatedRecipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
