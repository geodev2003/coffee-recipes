import React, { useState } from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdvancedSearch = ({ onSearch, onFilterChange, filters = {} }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState({
        difficulty: filters.difficulty || '',
        prepTime: filters.prepTime || '',
        minRating: filters.minRating || '',
        category: filters.category || 'All',
    });

    const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
    const prepTimeRanges = [
        { label: 'All', value: '' },
        { label: 'Quick (0-15 min)', value: '0-15' },
        { label: 'Medium (16-30 min)', value: '16-30' },
        { label: 'Long (31+ min)', value: '31+' },
    ];
    const categories = ['All', 'Coffee', 'Tea', 'Mocktail'];

    const handleSearch = (value) => {
        setSearchTerm(value);
        onSearch(value);
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const clearedFilters = {
            difficulty: '',
            prepTime: '',
            minRating: '',
            category: 'All',
        };
        setLocalFilters(clearedFilters);
        onFilterChange(clearedFilters);
    };

    const hasActiveFilters = localFilters.difficulty || localFilters.prepTime || localFilters.minRating || localFilters.category !== 'All';

    return (
        <div className="w-full">
            {/* Search Bar */}
            <div className="relative mb-4">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-espresso-800/40" size={22} />
                <input
                    type="text"
                    placeholder="Search recipes by name or description..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="search-input w-full"
                />
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
                        showFilters || hasActiveFilters
                            ? 'bg-forest-800 text-white'
                            : 'text-espresso-800/60 hover:bg-forest-800/5'
                    }`}
                >
                    <SlidersHorizontal size={20} />
                </button>
            </div>

            {/* Active Filters Badges */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {localFilters.difficulty && (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-forest-800/10 text-forest-800 rounded-full text-sm font-medium">
                            Difficulty: {localFilters.difficulty}
                            <button
                                onClick={() => handleFilterChange('difficulty', '')}
                                className="hover:bg-forest-800/20 rounded-full p-0.5"
                            >
                                <X size={14} />
                            </button>
                        </span>
                    )}
                    {localFilters.prepTime && (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-forest-800/10 text-forest-800 rounded-full text-sm font-medium">
                            Time: {prepTimeRanges.find(r => r.value === localFilters.prepTime)?.label}
                            <button
                                onClick={() => handleFilterChange('prepTime', '')}
                                className="hover:bg-forest-800/20 rounded-full p-0.5"
                            >
                                <X size={14} />
                            </button>
                        </span>
                    )}
                    {localFilters.minRating && (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-forest-800/10 text-forest-800 rounded-full text-sm font-medium">
                            Rating: {localFilters.minRating}+ ⭐
                            <button
                                onClick={() => handleFilterChange('minRating', '')}
                                className="hover:bg-forest-800/20 rounded-full p-0.5"
                            >
                                <X size={14} />
                            </button>
                        </span>
                    )}
                    {localFilters.category !== 'All' && (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-forest-800/10 text-forest-800 rounded-full text-sm font-medium">
                            Category: {localFilters.category}
                            <button
                                onClick={() => handleFilterChange('category', 'All')}
                                className="hover:bg-forest-800/20 rounded-full p-0.5"
                            >
                                <X size={14} />
                            </button>
                        </span>
                    )}
                    <button
                        onClick={clearFilters}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition-colors"
                    >
                        <X size={14} />
                        Clear All
                    </button>
                </div>
            )}

            {/* Advanced Filters Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass-card p-6 mb-4 overflow-hidden"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-coffee-900 mb-2">
                                    Category
                                </label>
                                <select
                                    value={localFilters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-coffee-900/20 bg-white text-coffee-900 focus:outline-none focus:ring-2 focus:ring-forest-800 focus:border-transparent"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Difficulty Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-coffee-900 mb-2">
                                    Difficulty
                                </label>
                                <select
                                    value={localFilters.difficulty}
                                    onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-coffee-900/20 bg-white text-coffee-900 focus:outline-none focus:ring-2 focus:ring-forest-800 focus:border-transparent"
                                >
                                    <option value="">All</option>
                                    {difficulties.filter(d => d !== 'All').map((diff) => (
                                        <option key={diff} value={diff}>
                                            {diff}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Prep Time Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-coffee-900 mb-2">
                                    Prep Time
                                </label>
                                <select
                                    value={localFilters.prepTime}
                                    onChange={(e) => handleFilterChange('prepTime', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-coffee-900/20 bg-white text-coffee-900 focus:outline-none focus:ring-2 focus:ring-forest-800 focus:border-transparent"
                                >
                                    {prepTimeRanges.map((range) => (
                                        <option key={range.value} value={range.value}>
                                            {range.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Rating Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-coffee-900 mb-2">
                                    Min Rating
                                </label>
                                <select
                                    value={localFilters.minRating}
                                    onChange={(e) => handleFilterChange('minRating', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-coffee-900/20 bg-white text-coffee-900 focus:outline-none focus:ring-2 focus:ring-forest-800 focus:border-transparent"
                                >
                                    <option value="">All</option>
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <option key={rating} value={rating}>
                                            {rating}+ ⭐
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdvancedSearch;

