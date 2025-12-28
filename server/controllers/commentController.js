const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');

// Get comments for a recipe
exports.getComments = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const comments = await Comment.find({ recipeId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Comment.countDocuments({ recipeId });

    res.status(200).json({
      success: true,
      comments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create comment
exports.createComment = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { content, rating } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Get user info
    const user = req.user;

    // Create comment
    const comment = await Comment.create({
      recipeId,
      userId: user._id,
      username: user.username,
      content: content.trim(),
      rating: rating || null
    });

    // Update recipe rating if rating provided
    if (rating) {
      const allComments = await Comment.find({ recipeId });
      const avgRating = allComments.reduce((sum, c) => sum + (c.rating || 0), 0) / allComments.length;
      await Recipe.findByIdAndUpdate(recipeId, {
        rating: Math.round(avgRating * 10) / 10,
        reviewsCount: allComments.length
      });
    }

    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'username');

    res.status(201).json({
      success: true,
      comment: populatedComment
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update comment
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content, rating } = req.body;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    // Update comment
    if (content) comment.content = content.trim();
    if (rating !== undefined) comment.rating = rating;

    await comment.save();

    // Update recipe rating
    if (rating) {
      const allComments = await Comment.find({ recipeId: comment.recipeId });
      const avgRating = allComments.reduce((sum, c) => sum + (c.rating || 0), 0) / allComments.length;
      await Recipe.findByIdAndUpdate(comment.recipeId, {
        rating: Math.round(avgRating * 10) / 10
      });
    }

    const updatedComment = await Comment.findById(commentId)
      .populate('userId', 'username');

    res.status(200).json({
      success: true,
      comment: updatedComment
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment or is admin
    if (comment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    const recipeId = comment.recipeId;

    await Comment.findByIdAndDelete(commentId);

    // Update recipe rating
    const allComments = await Comment.find({ recipeId });
    if (allComments.length > 0) {
      const avgRating = allComments.reduce((sum, c) => sum + (c.rating || 0), 0) / allComments.length;
      await Recipe.findByIdAndUpdate(recipeId, {
        rating: Math.round(avgRating * 10) / 10,
        reviewsCount: allComments.length
      });
    } else {
      await Recipe.findByIdAndUpdate(recipeId, {
        rating: 0,
        reviewsCount: 0
      });
    }

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like/Unlike comment
exports.toggleLike = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const isLiked = comment.likes.includes(userId);

    if (isLiked) {
      comment.likes = comment.likes.filter(id => id.toString() !== userId.toString());
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.status(200).json({
      success: true,
      liked: !isLiked,
      likesCount: comment.likes.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add reply to comment
exports.addReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Reply content is required' });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.replies.push({
      userId: req.user._id,
      username: req.user.username,
      content: content.trim()
    });

    await comment.save();

    res.status(201).json({
      success: true,
      comment
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

