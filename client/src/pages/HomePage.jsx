import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Sparkles, Star, ArrowRight } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import AdvancedSearch from '../components/AdvancedSearch';
import Pagination from '../components/Pagination';
import { getRecipes, getFeaturedRecipes } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const HomePage = () => {
    const [recipes, setRecipes] = useState([]);
    const [featuredRecipes, setFeaturedRecipes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalRecipes: 0 });
    const [loading, setLoading] = useState(true);
    const [featuredLoading, setFeaturedLoading] = useState(true);

    const recipesPerPage = 12;

    // Fetch featured recipes on mount
    useEffect(() => {
        const fetchFeatured = async () => {
            setFeaturedLoading(true);
            try {
                const data = await getFeaturedRecipes(6);
                setFeaturedRecipes(data || []);
            } catch (error) {
                console.error('Error fetching featured recipes:', error);
            } finally {
                setFeaturedLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    // Fetch recipes with filters and pagination
    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                const response = await getRecipes(
                    searchTerm,
                    filters.category || 'All',
                    filters,
                    currentPage,
                    recipesPerPage
                );
                
                if (response.recipes) {
                    setRecipes(response.recipes || []);
                    setPagination(response.pagination || { currentPage: 1, totalPages: 1, totalRecipes: 0 });
                } else {
                    // Fallback for old API format
                    setRecipes(response || []);
                    setPagination({ currentPage: 1, totalPages: 1, totalRecipes: response?.length || 0 });
                }
            } catch (error) {
                console.error('Error fetching recipes:', error);
                setRecipes([]);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchRecipes();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, filters, currentPage]);

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Skeleton loader component
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
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <section className="relative py-20 px-6 text-center overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 bg-gradient-warm opacity-50" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-forest-700/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-espresso-900/5 rounded-full blur-3xl" />
                
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-5xl mx-auto relative z-10 pt-8"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="flex justify-center mb-8"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-forest rounded-full blur-xl opacity-50 animate-pulse" />
                            <div className="relative p-4 bg-gradient-forest rounded-full text-white shadow-2xl">
                                <Coffee size={40} className="relative z-10" />
                            </div>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-2 -right-2"
                            >
                                <Sparkles size={24} className="text-gold-400" />
                            </motion.div>
                        </div>
                    </motion.div>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 bg-gradient-coffee bg-clip-text text-transparent"
                    >
                        Welcome to BrewVibe
                    </motion.h1>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-xl md:text-2xl text-espresso-800/70 max-w-3xl mx-auto font-light leading-relaxed text-balance"
                    >
                        Discover curated premium coffee, tea, and beverage recipes crafted for the modern connoisseur
                    </motion.p>
                </motion.div>
            </section>

            {/* Featured Recipes Section */}
            {featuredRecipes.length > 0 && (
                <section className="max-w-7xl mx-auto px-6 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center justify-between mb-8"
                    >
                        <div>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 mb-2 flex items-center gap-3">
                                <Star className="text-gold-500 fill-current" size={32} />
                                Featured Recipes
                            </h2>
                            <p className="text-coffee-600/70">
                                Handpicked favorites from our collection
                            </p>
                        </div>
                        <Link
                            to="/"
                            className="hidden md:flex items-center gap-2 text-forest-800 hover:text-forest-900 font-semibold transition-colors"
                        >
                            View All
                            <ArrowRight size={20} />
                        </Link>
                    </motion.div>

                    {featuredLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(3)].map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredRecipes.map((recipe, index) => (
                                <motion.div
                                    key={recipe._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <RecipeCard recipe={recipe} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Search & Filter */}
            <section className="px-6 mb-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="max-w-5xl mx-auto"
                >
                    <AdvancedSearch
                        onSearch={handleSearch}
                        onFilterChange={handleFilterChange}
                        filters={filters}
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
                        <>
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
                                        transition={{ delay: index * 0.05, duration: 0.4 }}
                                    >
                                        <RecipeCard recipe={recipe} />
                                    </motion.div>
                                ))}
                            </motion.div>
                            
                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <Pagination
                                    currentPage={pagination.currentPage}
                                    totalPages={pagination.totalPages}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-24"
                        >
                            <div className="max-w-md mx-auto">
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                    className="flex justify-center mb-6"
                                >
                                    <Coffee size={64} className="text-espresso-800/20" />
                                </motion.div>
                                <h3 className="text-2xl font-serif font-semibold text-espresso-900 mb-3">
                                    No recipes found
                                </h3>
                                <p className="text-espresso-800/60 text-lg mb-6">
                                    Try adjusting your search or filters to discover more recipes
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default HomePage;
