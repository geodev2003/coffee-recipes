import React, { useState, useEffect } from 'react';
import { Heart, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getWishlist } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import ProtectedRoute from '../components/ProtectedRoute';

const WishlistPage = () => {
  const { isAuthenticated } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await getWishlist();
      if (response.success) {
        setRecipes(response.recipes || []);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const SkeletonCard = () => (
    <div className="glass-card overflow-hidden animate-pulse">
      <div className="h-48 skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-6 skeleton rounded-lg w-3/4" />
        <div className="h-4 skeleton rounded w-full" />
        <div className="h-4 skeleton rounded w-2/3" />
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-20 pt-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex mb-6"
            >
              <div className="p-4 bg-red-500/10 rounded-full text-red-600">
                <Heart size={40} className="fill-current" />
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-coffee bg-clip-text text-transparent mb-4">
              My Wishlist
            </h1>
            <p className="text-coffee-600/70 text-lg">
              Your favorite recipes saved for later
            </p>
          </motion.header>

          {/* Recipes Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : recipes.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {recipes.map((recipe, index) => (
                <motion.div
                  key={recipe._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24"
            >
              <div className="max-w-md mx-auto">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="flex justify-center mb-6"
                >
                  <Heart size={64} className="text-coffee-800/20" />
                </motion.div>
                <h3 className="text-2xl font-serif font-semibold text-coffee-900 mb-3">
                  Your wishlist is empty
                </h3>
                <p className="text-coffee-600/60 text-lg mb-6">
                  Start saving your favorite recipes to see them here
                </p>
                <motion.a
                  href="/"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Coffee size={20} />
                  Browse Recipes
                </motion.a>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default WishlistPage;

