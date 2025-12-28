import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Heart, Send, Edit2, Trash2, Reply, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getComments, createComment, updateComment, deleteComment, toggleCommentLike, addReply } from '../services/api';

const CommentSection = ({ recipeId }) => {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [recipeId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await getComments(recipeId);
      if (response.success) {
        setComments(response.comments || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await createComment(recipeId, newComment.trim(), rating || null);
      if (response.success) {
        setNewComment('');
        setRating(0);
        fetchComments();
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      alert('Failed to post comment');
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      const response = await updateComment(commentId, editContent.trim());
      if (response.success) {
        setEditingId(null);
        setEditContent('');
        fetchComments();
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await deleteComment(commentId);
      if (response.success) {
        fetchComments();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleLike = async (commentId) => {
    if (!isAuthenticated) {
      alert('Please login to like comments');
      return;
    }

    try {
      await toggleCommentLike(commentId);
      fetchComments();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleReply = async (commentId) => {
    if (!replyContent.trim()) return;

    try {
      const response = await addReply(commentId, replyContent.trim());
      if (response.success) {
        setReplyingTo(null);
        setReplyContent('');
        fetchComments();
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const renderStars = (value, interactive = false, onChange = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onChange && onChange(star)}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
            disabled={!interactive}
          >
            <Star
              size={20}
              className={star <= value ? 'text-gold-500 fill-current' : 'text-coffee-600/30'}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-serif font-bold text-coffee-900 mb-6 flex items-center gap-3">
        <MessageSquare size={32} className="text-forest-800" />
        Comments & Reviews
      </h2>

      {/* Comment Form */}
      {isAuthenticated ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-8"
        >
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-coffee-800">
                Your Comment
              </label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                className="search-input"
                placeholder="Share your thoughts about this recipe..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-coffee-800">
                Rating (Optional)
              </label>
              {renderStars(rating, true, setRating)}
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary flex items-center gap-2"
            >
              <Send size={18} />
              Post Comment
            </motion.button>
          </form>
        </motion.div>
      ) : (
        <div className="glass-card p-6 mb-8 text-center">
          <p className="text-coffee-600/70 mb-4">
            Please <a href="/login" className="text-forest-800 hover:text-forest-900 font-semibold">login</a> to leave a comment
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-4 skeleton rounded w-1/4 mb-3" />
              <div className="h-4 skeleton rounded w-full mb-2" />
              <div className="h-4 skeleton rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              {editingId === comment._id ? (
                <div className="space-y-4">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    className="search-input"
                  />
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleUpdateComment(comment._id)}
                      className="btn-primary text-sm"
                    >
                      Save
                    </motion.button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditContent('');
                      }}
                      className="btn-secondary text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-coffee-900">{comment.username}</h4>
                        {comment.rating && (
                          <div className="flex items-center gap-1">
                            {renderStars(comment.rating)}
                          </div>
                        )}
                        <span className="text-xs text-coffee-600/60">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-coffee-800/80 leading-relaxed">{comment.content}</p>
                    </div>
                    {isAuthenticated && (
                      (user?.id?.toString() === comment.userId?._id?.toString()) ||
                      (user?.id?.toString() === comment.userId?.toString())
                    ) && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(comment._id);
                            setEditContent(comment.content);
                          }}
                          className="p-2 hover:bg-coffee-900/5 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} className="text-coffee-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-coffee-900/10">
                    <button
                      onClick={() => handleLike(comment._id)}
                      className={`flex items-center gap-2 text-sm transition-colors ${
                        isAuthenticated && comment.likes?.some(likeId => likeId.toString() === user?.id?.toString())
                          ? 'text-red-600'
                          : 'text-coffee-600 hover:text-red-600'
                      }`}
                    >
                      <Heart
                        size={18}
                        className={isAuthenticated && comment.likes?.some(likeId => likeId.toString() === user?.id?.toString()) ? 'fill-current' : ''}
                      />
                      {comment.likes?.length || 0}
                    </button>
                    {isAuthenticated && (
                      <button
                        onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                        className="flex items-center gap-2 text-sm text-coffee-600 hover:text-coffee-900 transition-colors"
                      >
                        <Reply size={18} />
                        Reply
                      </button>
                    )}
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-coffee-900/10"
                    >
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Write a reply..."
                          className="flex-1 search-input"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleReply(comment._id)}
                          className="btn-primary"
                        >
                          <Send size={18} />
                        </motion.button>
                        <button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                          }}
                          className="btn-secondary"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-coffee-900/10 space-y-3 pl-6">
                      {comment.replies.map((reply, index) => (
                        <div key={index} className="bg-cream-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-coffee-900 text-sm">{reply.username}</span>
                            <span className="text-xs text-coffee-600/60">
                              {new Date(reply.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-coffee-800/80">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <MessageSquare size={48} className="text-coffee-800/20 mx-auto mb-4" />
          <p className="text-coffee-600/70">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;

