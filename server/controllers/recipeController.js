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
        const newRecipe = new Recipe(req.body);
        const savedRecipe = await newRecipe.save();
        res.status(201).json(savedRecipe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update recipe
exports.updateRecipe = async (req, res) => {
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedRecipe) return res.status(404).json({ message: 'Recipe not found' });
        res.status(200).json(updatedRecipe);
    } catch (error) {
        res.status(400).json({ message: error.message });
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
