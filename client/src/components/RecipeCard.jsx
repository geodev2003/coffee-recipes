import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Gauge, Flame, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const RecipeCard = ({ recipe }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const getDifficultyColor = (difficulty) => {
        const diff = difficulty?.toLowerCase() || '';
        if (diff.includes('easy')) return 'text-forest-700 bg-forest-700/10';
        if (diff.includes('medium')) return 'text-gold-500 bg-gold-500/10';
        if (diff.includes('hard')) return 'text-red-600 bg-red-600/10';
        return 'text-espresso-700 bg-espresso-700/10';
    };

    const handleCardClick = () => {
        navigate(`/recipe/${recipe._id}`);
    };

    return (
        <motion.div
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCardClick}
            className="glass-card overflow-hidden cursor-pointer group"
        >
            <div className="h-56 overflow-hidden relative">
                <motion.img
                    src={
                        (recipe.images && recipe.images.length > 0)
                            ? recipe.images[0]
                            : (recipe.image || recipe.imageUrl || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800")
                    }
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                    animate={{ scale: isHovered ? 1.1 : 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                />
                {/* Gradient overlay on hover */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-espresso-900/60 via-transparent to-transparent"
                />
                
                {/* Category badge */}
                <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-forest-800 shadow-lg"
                >
                    {recipe.category || 'Recipe'}
                </motion.span>

                {/* View recipe button on hover */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ 
                        y: isHovered ? 0 : 20,
                        opacity: isHovered ? 1 : 0
                    }}
                    className="absolute bottom-4 left-4 right-4"
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/recipe/${recipe._id}`);
                        }}
                        className="w-full bg-white/95 backdrop-blur-sm text-forest-800 px-4 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:bg-white transition-colors"
                    >
                        View Recipe
                        <ArrowRight size={18} />
                    </button>
                </motion.div>
            </div>

            <div className="p-6">
                <h3 className="text-2xl font-serif font-bold mb-3 text-espresso-900 line-clamp-1 group-hover:text-forest-800 transition-colors">
                    {recipe.title}
                </h3>
                <p className="text-sm text-espresso-800/70 mb-5 line-clamp-2 leading-relaxed">
                    {recipe.description || 'Discover the perfect blend of flavors and aromas in this exquisite recipe.'}
                </p>

                <div className="flex items-center flex-wrap gap-4 pt-4 border-t border-espresso-900/10">
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center gap-2 text-sm text-espresso-800 font-medium"
                    >
                        <div className="p-1.5 bg-forest-700/10 rounded-lg">
                            <Clock size={16} className="text-forest-700" />
                        </div>
                        <span>{recipe.prepTime || 'N/A'} min</span>
                    </motion.div>
                    
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={`flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-lg ${getDifficultyColor(recipe.difficulty)}`}
                    >
                        <Gauge size={16} />
                        <span className="capitalize">{recipe.difficulty || 'N/A'}</span>
                    </motion.div>
                    
                    {recipe.calories && (
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="flex items-center gap-2 text-sm text-espresso-800 font-medium"
                        >
                            <div className="p-1.5 bg-gold-400/10 rounded-lg">
                                <Flame size={16} className="text-gold-500" />
                            </div>
                            <span>{recipe.calories} cal</span>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default RecipeCard;
