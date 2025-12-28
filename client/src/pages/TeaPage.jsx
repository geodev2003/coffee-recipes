import React, { useState, useEffect } from 'react';
import { Leaf, Search } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import { getRecipes } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const TeaPage = () => {
    const [recipes, setRecipes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                const response = await getRecipes(searchTerm, 'Tea', {}, 1, 100);
                // Handle new API format with pagination
                if (response.recipes) {
                    setRecipes(response.recipes || []);
                } else {
                    // Fallback for old format
                    setRecipes(Array.isArray(response) ? response : []);
                }
            } catch (error) {
                console.error('Error fetching tea recipes:', error);
                setRecipes([]);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchRecipes();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const SkeletonCard = () => (
        <div className="glass-card overflow-hidden animate-pulse">
            <div className="h-48 skeleton" />
            <div className="p-5 space-y-3">
                <div className="h-6 skeleton rounded-lg w-3/4" />
                <div className="h-4 skeleton rounded w-full" />
                <div className="h-4 skeleton rounded w-2/3" />
                <div className="flex gap-4 mt-4">
                    <div className="h-4 skeleton rounded w-16" />
                    <div className="h-4 skeleton rounded w-16" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pb-20 pt-8">
            {/* Page Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12 px-6"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="inline-flex items-center justify-center mb-6"
                >
                    <div className="p-4 bg-gradient-to-br from-forest-700 to-forest-600 rounded-full text-white shadow-2xl">
                        <Leaf size={40} />
                    </div>
                </motion.div>
                <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 bg-gradient-forest bg-clip-text text-transparent">
                    Tea Collection
                </h1>
                <p className="text-xl text-espresso-800/70 max-w-2xl mx-auto">
                    Explore the world of fine teas and herbal infusions
                </p>
            </motion.header>

            {/* Search Bar */}
            <section className="max-w-4xl mx-auto px-6 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative"
                >
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-espresso-800/40" size={22} />
                    <input
                        type="text"
                        placeholder="Search tea recipes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </motion.div>
            </section>

            {/* Recipe Grid */}
            <main className="max-w-7xl mx-auto px-6">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {[...Array(6)].map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </motion.div>
                    ) : recipes.length > 0 ? (
                        <motion.div
                            key="recipes"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {recipes.map((recipe, index) => (
                                <motion.div
                                    key={recipe._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                >
                                    <RecipeCard recipe={recipe} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-24"
                        >
                            <Leaf size={64} className="text-espresso-800/20 mx-auto mb-6" />
                            <h3 className="text-2xl font-serif font-semibold text-espresso-900 mb-3">
                                No tea recipes found
                            </h3>
                            <p className="text-espresso-800/60 text-lg">
                                Try adjusting your search to discover more recipes
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default TeaPage;

