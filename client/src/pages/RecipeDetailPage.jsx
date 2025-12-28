import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, Gauge, Flame, ArrowLeft, Coffee, Leaf, GlassWater, Share2, Heart } from 'lucide-react';
import { getRecipeById, getRelatedRecipes, trackView } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { addToWishlist, removeFromWishlist, checkWishlist } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import CommentSection from '../components/CommentSection';
import PrintRecipe from '../components/PrintRecipe';
import { motion } from 'framer-motion';

const RecipeDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [relatedRecipes, setRelatedRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingRelated, setLoadingRelated] = useState(false);
    const [error, setError] = useState(null);
    const [inWishlist, setInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchRecipe = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getRecipeById(id);
                if (data) {
                    setRecipe(data);
                    // Track view
                    trackView(id);
                    
                    // Fetch related recipes
                    fetchRelatedRecipes(id);
                    
                    // Check wishlist status
                    if (isAuthenticated) {
                        checkWishlistStatus(id);
                    }
                } else {
                    setError('Recipe not found');
                }
            } catch (err) {
                console.error('Error fetching recipe:', err);
                setError('Failed to load recipe');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRecipe();
        }
    }, [id, isAuthenticated]);

    const fetchRelatedRecipes = async (recipeId) => {
        setLoadingRelated(true);
        try {
            const related = await getRelatedRecipes(recipeId, 4);
            setRelatedRecipes(related || []);
        } catch (err) {
            console.error('Error fetching related recipes:', err);
        } finally {
            setLoadingRelated(false);
        }
    };

    const checkWishlistStatus = async (recipeId) => {
        try {
            const response = await checkWishlist(recipeId);
            setInWishlist(response.inWishlist || false);
        } catch (error) {
            console.error('Error checking wishlist:', error);
        }
    };

    const handleWishlistToggle = async () => {
        if (!isAuthenticated) {
            alert('Please login to save recipes to wishlist');
            return;
        }

        setWishlistLoading(true);
        try {
            if (inWishlist) {
                await removeFromWishlist(id);
                setInWishlist(false);
            } else {
                await addToWishlist(id);
                setInWishlist(true);
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            alert('Failed to update wishlist');
        } finally {
            setWishlistLoading(false);
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Coffee':
                return <Coffee size={24} />;
            case 'Tea':
                return <Leaf size={24} />;
            case 'Mocktail':
                return <GlassWater size={24} />;
            default:
                return <Coffee size={24} />;
        }
    };

    const getDifficultyColor = (difficulty) => {
        const diff = difficulty?.toLowerCase() || '';
        if (diff.includes('easy')) return 'text-forest-700 bg-forest-700/10';
        if (diff.includes('medium')) return 'text-gold-500 bg-gold-500/10';
        if (diff.includes('hard')) return 'text-red-600 bg-red-600/10';
        return 'text-coffee-700 bg-coffee-700/10';
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: recipe.title,
                    text: recipe.description,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-pulse text-coffee-600 text-lg">Loading recipe...</div>
                </div>
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-serif font-bold text-coffee-900 mb-4">
                        Recipe Not Found
                    </h2>
                    <p className="text-coffee-600/70 mb-6">{error || 'The recipe you are looking for does not exist.'}</p>
                    <Link to="/" className="btn-primary inline-flex items-center gap-2">
                        <ArrowLeft size={20} />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Back Button */}
            <div className="max-w-5xl mx-auto px-6 pt-8 mb-6">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-coffee-600 hover:text-coffee-900 transition-colors font-medium"
                >
                    <ArrowLeft size={20} />
                    Back
                </motion.button>
            </div>

            <div className="max-w-5xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
                >
                    {/* Image */}
                    <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-card">
                        <img
                            src={recipe.image || recipe.imageUrl || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800"}
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4">
                            <span className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider text-forest-800 shadow-lg flex items-center gap-2">
                                {getCategoryIcon(recipe.category)}
                                {recipe.category}
                            </span>
                        </div>
                    </div>

                    {/* Recipe Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-coffee-900 mb-4">
                                {recipe.title}
                            </h1>
                            <p className="text-lg text-coffee-800/70 leading-relaxed">
                                {recipe.description}
                            </p>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-cream-100 rounded-xl">
                                <Clock size={20} className="text-forest-700" />
                                <span className="font-semibold text-coffee-900">{recipe.prepTime} min</span>
                            </div>
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
                                <Gauge size={20} />
                                <span className="capitalize">{recipe.difficulty}</span>
                            </div>
                            {recipe.calories && (
                                <div className="flex items-center gap-2 px-4 py-2 bg-gold-400/10 rounded-xl">
                                    <Flame size={20} className="text-gold-500" />
                                    <span className="font-semibold text-coffee-900">{recipe.calories} cal</span>
                                </div>
                            )}
                            {recipe.rating > 0 && (
                                <div className="flex items-center gap-2 px-4 py-2 bg-cream-100 rounded-xl">
                                    <Heart size={20} className="text-red-500 fill-current" />
                                    <span className="font-semibold text-coffee-900">
                                        {recipe.rating.toFixed(1)} ({recipe.reviewsCount || 0})
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleShare}
                                className="btn-secondary flex items-center gap-2 flex-1 min-w-[120px]"
                            >
                                <Share2 size={20} />
                                Share
                            </motion.button>
                            {recipe && <PrintRecipe recipe={recipe} />}
                            {isAuthenticated && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleWishlistToggle}
                                    disabled={wishlistLoading}
                                    className={`flex items-center gap-2 flex-1 min-w-[120px] ${
                                        inWishlist
                                            ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                            : 'btn-secondary'
                                    }`}
                                >
                                    <Heart
                                        size={20}
                                        className={inWishlist ? 'fill-current' : ''}
                                    />
                                    {inWishlist ? 'Saved' : 'Save'}
                                </motion.button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Ingredients & Instructions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Ingredients */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-6"
                    >
                        <h2 className="text-2xl font-serif font-bold text-coffee-900 mb-6">
                            Ingredients
                        </h2>
                        <ul className="space-y-3">
                            {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
                                recipe.ingredients.map((ingredient, index) => {
                                    // Handle both object and string format
                                    const ing = typeof ingredient === 'object' ? ingredient : { name: ingredient, amount: '', unit: '' };
                                    return (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + index * 0.05 }}
                                            className="flex items-start gap-3 p-3 bg-cream-50 rounded-lg"
                                        >
                                            <span className="text-forest-800 font-bold mt-1">•</span>
                                            <div className="flex-1">
                                                <span className="font-semibold text-coffee-900">{ing.name}</span>
                                                {(ing.amount || ing.unit) && (
                                                    <span className="text-coffee-600/70 ml-2">
                                                        {ing.amount} {ing.unit}
                                                    </span>
                                                )}
                                            </div>
                                        </motion.li>
                                    );
                                })
                            ) : (
                                <li className="text-coffee-600/70">No ingredients listed</li>
                            )}
                        </ul>
                    </motion.div>

                    {/* Instructions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-6"
                    >
                        <h2 className="text-2xl font-serif font-bold text-coffee-900 mb-6">
                            Instructions
                        </h2>
                        <ol className="space-y-4">
                            {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 ? (
                                recipe.instructions.map((instruction, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + index * 0.05 }}
                                        className="flex gap-4"
                                    >
                                        <span className="flex-shrink-0 w-8 h-8 bg-gradient-forest text-white rounded-full flex items-center justify-center font-bold">
                                            {index + 1}
                                        </span>
                                        <p className="flex-1 text-coffee-800/80 leading-relaxed pt-1">
                                            {instruction}
                                        </p>
                                    </motion.li>
                                ))
                            ) : (
                                <li className="text-coffee-600/70">No instructions available</li>
                            )}
                        </ol>
                    </motion.div>
                </div>

                {/* Related Recipes Section */}
                {relatedRecipes.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-serif font-bold text-coffee-900 mb-2">
                                    Related {recipe.category} Recipes
                                </h2>
                                <p className="text-coffee-600/70">
                                    Discover more {recipe.category.toLowerCase()} recipes you might enjoy
                                </p>
                            </div>
                            <Link
                                to={`/${recipe.category.toLowerCase()}`}
                                className="text-forest-800 hover:text-forest-900 font-semibold transition-colors whitespace-nowrap ml-4"
                            >
                                View All →
                            </Link>
                        </div>

                        {loadingRelated ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="glass-card overflow-hidden animate-pulse">
                                        <div className="h-48 skeleton" />
                                        <div className="p-5 space-y-3">
                                            <div className="h-6 skeleton rounded-lg w-3/4" />
                                            <div className="h-4 skeleton rounded w-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedRecipes.map((relatedRecipe, index) => (
                                    <motion.div
                                        key={relatedRecipe._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 + index * 0.1 }}
                                    >
                                        <RecipeCard recipe={relatedRecipe} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Fallback if no related recipes */}
                {!loadingRelated && relatedRecipes.length === 0 && recipe && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 text-center py-12 glass-card"
                    >
                        <h3 className="text-xl font-serif font-bold text-coffee-900 mb-3">
                            Explore More {recipe.category} Recipes
                        </h3>
                        <p className="text-coffee-600/70 mb-6">
                            Check out our full collection of {recipe.category.toLowerCase()} recipes
                        </p>
                        <Link
                            to={`/${recipe.category.toLowerCase()}`}
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            View All {recipe.category} Recipes
                            <ArrowLeft size={20} className="rotate-180" />
                        </Link>
                    </motion.div>
                )}

                {/* Comments Section */}
                <CommentSection recipeId={id} />
            </div>
        </div>
    );
};

export default RecipeDetailPage;

