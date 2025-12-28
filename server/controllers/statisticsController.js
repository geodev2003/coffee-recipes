const Recipe = require('../models/Recipe');
const { View, Visitor } = require('../models/Statistics');
const mongoose = require('mongoose');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Total recipes count
    const totalRecipes = await Recipe.countDocuments();
    
    // Recipes by category
    const recipesByCategory = await Recipe.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Total views count
    const totalViews = await View.countDocuments();

    // Views per recipe
    const viewsPerRecipe = await View.aggregate([
      {
        $group: {
          _id: '$recipeId',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'recipes',
          localField: '_id',
          foreignField: '_id',
          as: 'recipe'
        }
      },
      {
        $unwind: '$recipe'
      },
      {
        $project: {
          recipeTitle: '$recipe.title',
          views: '$count'
        }
      },
      {
        $sort: { views: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Total unique visitors (by IP)
    const uniqueVisitors = await Visitor.distinct('ipAddress').length;

    // Total visits count
    const totalVisits = await Visitor.countDocuments();

    // Visitors in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const visitorsLast7Days = await Visitor.countDocuments({
      visitedAt: { $gte: sevenDaysAgo }
    });

    // Visitors in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const visitorsLast30Days = await Visitor.countDocuments({
      visitedAt: { $gte: thirtyDaysAgo }
    });

    // Daily visitors for chart (last 7 days)
    const dailyVisitors = await Visitor.aggregate([
      {
        $match: {
          visitedAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$visitedAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        recipes: {
          total: totalRecipes,
          byCategory: recipesByCategory
        },
        views: {
          total: totalViews,
          topRecipes: viewsPerRecipe
        },
        visitors: {
          total: totalVisits,
          unique: uniqueVisitors,
          last7Days: visitorsLast7Days,
          last30Days: visitorsLast30Days,
          dailyChart: dailyVisitors
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Track recipe view
exports.trackView = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    await View.create({
      recipeId,
      ipAddress,
      userAgent
    });

    res.status(200).json({ success: true, message: 'View tracked' });
  } catch (error) {
    res.status(500).json({ message: 'Error tracking view', error: error.message });
  }
};

// Track visitor
exports.trackVisitor = async (req, res) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const path = req.query.path || '/';
    const sessionId = req.query.sessionId || '';

    await Visitor.create({
      ipAddress,
      userAgent,
      path,
      sessionId
    });

    res.status(200).json({ success: true, message: 'Visitor tracked' });
  } catch (error) {
    res.status(500).json({ message: 'Error tracking visitor', error: error.message });
  }
};

