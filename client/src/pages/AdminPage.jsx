import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Coffee, Leaf, GlassWater, LogOut, BarChart3, Eye, Users, BookOpen, TrendingUp, Search, Filter, UserCheck, UserX, Shield, User as UserIcon } from 'lucide-react';
import { getRecipes, createRecipe, updateRecipe, deleteRecipe, getAllUsers, updateUser, toggleUserStatus, deleteUser, getUserStats } from '../services/api';
import { getDashboardStats } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from '../components/ImageUpload';

const AdminPage = () => {
    const [recipes, setRecipes] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'recipes', or 'users'
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    // User management state
    const [users, setUsers] = useState([]);
    const [userStats, setUserStats] = useState(null);
    const [usersLoading, setUsersLoading] = useState(true);
    const [userPagination, setUserPagination] = useState({ currentPage: 1, totalPages: 1, totalUsers: 0 });
    const [userFilters, setUserFilters] = useState({ search: '', role: '', isActive: '' });
    const [editingUser, setEditingUser] = useState(null);
    const [showUserForm, setShowUserForm] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Coffee',
        prepTime: '',
        difficulty: 'Easy',
        calories: '',
        image: '', // Keep for backward compatibility
        images: '', // Multiple images (one URL per line)
        ingredients: '',
        instructions: '',
    });

    useEffect(() => {
        fetchRecipes();
        fetchStats();
        if (activeTab === 'users') {
            fetchUsers();
            fetchUserStats();
        }
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        }
    }, [userFilters, userPagination.currentPage]);

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            const response = await getRecipes('', 'All', {}, 1, 1000);
            // Handle new API format with pagination
            if (response.recipes) {
                setRecipes(response.recipes || []);
            } else {
                // Fallback for old format
                setRecipes(Array.isArray(response) ? response : []);
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setRecipes([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        setStatsLoading(true);
        try {
            const data = await getDashboardStats();
            setStats(data.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setStatsLoading(false);
        }
    };

    const fetchUsers = async () => {
        setUsersLoading(true);
        try {
            const response = await getAllUsers(
                userPagination.currentPage,
                10,
                userFilters.search,
                userFilters.role,
                userFilters.isActive
            );
            setUsers(response.data.users || []);
            setUserPagination(response.data.pagination || { currentPage: 1, totalPages: 1, totalUsers: 0 });
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        } finally {
            setUsersLoading(false);
        }
    };

    const fetchUserStats = async () => {
        try {
            const response = await getUserStats();
            setUserStats(response.data);
        } catch (error) {
            console.error('Error fetching user stats:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate required fields
            if (!formData.title || !formData.description || !formData.prepTime || !formData.ingredients || !formData.instructions) {
                alert('Please fill in all required fields');
                return;
            }

            // Parse ingredients (format: "name|amount|unit" per line, or just "name")
            const ingredientsArray = formData.ingredients
                .split('\n')
                .filter(i => i.trim())
                .map(line => {
                    const trimmedLine = line.trim();
                    // If line contains |, split by |, otherwise treat whole line as name
                    if (trimmedLine.includes('|')) {
                        const parts = trimmedLine.split('|').map(p => p.trim());
                        return {
                            name: parts[0] || '',
                            amount: parts[1] || '1', // Default to '1' if not provided
                            unit: parts[2] || ''
                        };
                    } else {
                        // If no |, treat entire line as ingredient name
                        return {
                            name: trimmedLine,
                            amount: '1', // Default amount
                            unit: ''
                        };
                    }
                })
                .filter(ing => ing.name && ing.name.trim()); // Remove empty ingredients

            if (ingredientsArray.length === 0) {
                alert('Please add at least one ingredient');
                return;
            }

            // Parse instructions
            const instructionsArray = formData.instructions
                .split('\n')
                .filter(i => i.trim());

            if (instructionsArray.length === 0) {
                alert('Please add at least one instruction');
                return;
            }

            // Parse images (one URL per line or from ImageUpload component)
            let imagesArray = [];
            if (formData.images) {
                // Check if it's a newline-separated string or already an array
                if (typeof formData.images === 'string') {
                    imagesArray = formData.images
                        .split('\n')
                        .filter(img => img.trim())
                        .map(img => img.trim());
                } else if (Array.isArray(formData.images)) {
                    imagesArray = formData.images.filter(img => img && img.trim());
                }
            }

            // If no images from images field, check single image field
            if (imagesArray.length === 0 && formData.image) {
                imagesArray = [formData.image];
            }

            const recipeData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                category: formData.category,
                prepTime: parseInt(formData.prepTime),
                difficulty: formData.difficulty || 'Easy',
                calories: formData.calories ? parseInt(formData.calories) : undefined,
                ingredients: ingredientsArray,
                instructions: instructionsArray,
                images: imagesArray.length > 0 ? imagesArray : undefined,
                image: formData.image || undefined, // Keep for backward compatibility
            };

            // Remove undefined fields
            Object.keys(recipeData).forEach(key => {
                if (recipeData[key] === undefined) {
                    delete recipeData[key];
                }
            });

            // Debug log
            console.log('Recipe data to send:', JSON.stringify(recipeData, null, 2));

            if (editingRecipe) {
                await updateRecipe(editingRecipe._id, recipeData);
                alert('Recipe updated successfully!');
            } else {
                await createRecipe(recipeData);
                alert('Recipe created successfully!');
            }

            resetForm();
            fetchRecipes();
            fetchStats(); // Refresh stats after creating/updating
        } catch (error) {
            console.error('Error saving recipe:', error);
            console.error('Error response:', error.response?.data);
            
            let errorMessage = 'Error saving recipe. Please try again.';
            
            if (error.response?.data) {
                const errorData = error.response.data;
                if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.errors && Array.isArray(errorData.errors)) {
                    errorMessage = errorData.errors.join(', ');
                } else if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else {
                    errorMessage = JSON.stringify(errorData);
                }
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            alert(`Error: ${errorMessage}`);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: 'Coffee',
            prepTime: '',
            difficulty: 'Easy',
            calories: '',
            image: '',
            images: '',
            ingredients: '',
            instructions: '',
        });
        setEditingRecipe(null);
        setShowForm(false);
    };

    const handleEdit = (recipe) => {
        setEditingRecipe(recipe);
        
        // Format ingredients for editing
        const ingredientsStr = Array.isArray(recipe.ingredients) 
            ? recipe.ingredients.map(ing => 
                typeof ing === 'object' 
                    ? `${ing.name}|${ing.amount}|${ing.unit || ''}` 
                    : ing
            ).join('\n')
            : '';

        // Format images for editing (support both images array and single image)
        const imagesStr = Array.isArray(recipe.images) && recipe.images.length > 0
            ? recipe.images.join('\n')
            : (recipe.image || '');

        setFormData({
            title: recipe.title || '',
            description: recipe.description || '',
            category: recipe.category || 'Coffee',
            prepTime: recipe.prepTime?.toString() || '',
            difficulty: recipe.difficulty || 'Easy',
            calories: recipe.calories?.toString() || '',
            image: recipe.image || '', // Keep for backward compatibility
            images: imagesStr, // New images field
            ingredients: ingredientsStr,
            instructions: Array.isArray(recipe.instructions) 
                ? recipe.instructions.join('\n') 
                : recipe.instructions || '',
        });
        setShowForm(true);
        setActiveTab('recipes');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this recipe?')) {
            return;
        }

        try {
            await deleteRecipe(id);
            fetchRecipes();
            fetchStats(); // Refresh stats after deleting
        } catch (error) {
            console.error('Error deleting recipe:', error);
            alert('Error deleting recipe. Please try again.');
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Coffee':
                return <Coffee size={20} />;
            case 'Tea':
                return <Leaf size={20} />;
            case 'Mocktail':
                return <GlassWater size={20} />;
            default:
                return <Coffee size={20} />;
        }
    };

    const StatCard = ({ icon: Icon, title, value, subtitle, color = 'forest' }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${color}-800/10 rounded-lg text-${color}-800`}>
                    <Icon size={24} />
                </div>
            </div>
            <h3 className="text-3xl font-bold text-coffee-900 mb-1">{value || '0'}</h3>
            <p className="text-coffee-600 font-semibold">{title}</p>
            {subtitle && <p className="text-sm text-coffee-600/60 mt-1">{subtitle}</p>}
        </motion.div>
    );

    return (
        <div className="min-h-screen pb-20 pt-8 bg-cream-50">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-coffee bg-clip-text text-transparent mb-2">
                                Admin Dashboard
                            </h1>
                            <p className="text-coffee-600/70">
                                Welcome back, {user?.username || 'Admin'}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="btn-secondary flex items-center gap-2"
                            >
                                <LogOut size={18} />
                                Logout
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setShowForm(true);
                                    setActiveTab('recipes');
                                }}
                                className="btn-primary flex items-center gap-2"
                            >
                                <Plus size={20} />
                                Add Recipe
                            </motion.button>
                        </div>
                    </div>
                </motion.header>

                {/* Tabs */}
                <div className="flex gap-3 mb-6 border-b border-coffee-900/10">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-6 py-3 font-semibold transition-all ${
                            activeTab === 'dashboard'
                                ? 'text-forest-800 border-b-2 border-forest-800'
                                : 'text-coffee-600 hover:text-coffee-900'
                        }`}
                    >
                        <BarChart3 size={20} className="inline-block mr-2" />
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('recipes')}
                        className={`px-6 py-3 font-semibold transition-all ${
                            activeTab === 'recipes'
                                ? 'text-forest-800 border-b-2 border-forest-800'
                                : 'text-coffee-600 hover:text-coffee-900'
                        }`}
                    >
                        <BookOpen size={20} className="inline-block mr-2" />
                        Recipes Management
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-3 font-semibold transition-all ${
                            activeTab === 'users'
                                ? 'text-forest-800 border-b-2 border-forest-800'
                                : 'text-coffee-600 hover:text-coffee-900'
                        }`}
                    >
                        <Users size={20} className="inline-block mr-2" />
                        Users Management
                    </button>
                </div>

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {statsLoading ? (
                            <div className="text-center py-20">
                                <div className="animate-pulse text-coffee-600">Loading statistics...</div>
                            </div>
                        ) : stats ? (
                            <>
                                {/* Statistics Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatCard
                                        icon={BookOpen}
                                        title="Total Recipes"
                                        value={stats.recipes?.total}
                                        subtitle={`${stats.recipes?.byCategory?.find(c => c._id === 'Coffee')?.count || 0} Coffee, ${stats.recipes?.byCategory?.find(c => c._id === 'Tea')?.count || 0} Tea, ${stats.recipes?.byCategory?.find(c => c._id === 'Mocktail')?.count || 0} Mocktail`}
                                        color="forest"
                                    />
                                    <StatCard
                                        icon={Eye}
                                        title="Total Views"
                                        value={stats.views?.total?.toLocaleString()}
                                        subtitle="Recipe page views"
                                        color="coffee"
                                    />
                                    <StatCard
                                        icon={Users}
                                        title="Unique Visitors"
                                        value={stats.visitors?.unique?.toLocaleString()}
                                        subtitle={`${stats.visitors?.last7Days || 0} in last 7 days`}
                                        color="forest"
                                    />
                                    <StatCard
                                        icon={TrendingUp}
                                        title="Total Visits"
                                        value={stats.visitors?.total?.toLocaleString()}
                                        subtitle={`${stats.visitors?.last30Days || 0} in last 30 days`}
                                        color="coffee"
                                    />
                                </div>

                                {/* Top Viewed Recipes */}
                                {stats.views?.topRecipes && stats.views.topRecipes.length > 0 && (
                                    <div className="glass-card p-6">
                                        <h2 className="text-2xl font-serif font-bold mb-4 text-coffee-900">
                                            Top Viewed Recipes
                                        </h2>
                                        <div className="space-y-3">
                                            {stats.views.topRecipes.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 bg-cream-50 rounded-lg"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-2xl font-bold text-coffee-600/40 w-8">
                                                            {index + 1}
                                                        </span>
                                                        <span className="font-semibold text-coffee-900">
                                                            {item.recipeTitle}
                                                        </span>
                                                    </div>
                                                    <span className="text-forest-800 font-bold">
                                                        {item.views} views
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-coffee-600/60">No statistics available</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Recipes Management Tab */}
                {activeTab === 'recipes' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {/* Recipe Form Modal */}
                        <AnimatePresence mode="wait">
                            {showForm && (
                                <motion.div
                                    key="modal-overlay"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-coffee-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 md:p-6"
                                    onClick={resetForm}
                                >
                                    <motion.div
                                        key="modal-content"
                                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                        animate={{ scale: 1, opacity: 1, y: 0 }}
                                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-2xl font-serif font-bold text-coffee-900">
                                                {editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}
                                            </h2>
                                            <button
                                                onClick={resetForm}
                                                className="p-2 hover:bg-coffee-900/5 rounded-lg transition-colors"
                                            >
                                                <X size={24} />
                                            </button>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold mb-2 text-coffee-800">
                                                    Title *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    className="search-input"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold mb-2 text-coffee-800">
                                                    Description *
                                                </label>
                                                <textarea
                                                    required
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    rows={3}
                                                    className="search-input"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold mb-2 text-coffee-800">
                                                        Category *
                                                    </label>
                                                    <select
                                                        value={formData.category}
                                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                        className="search-input"
                                                    >
                                                        <option value="Coffee">Coffee</option>
                                                        <option value="Tea">Tea</option>
                                                        <option value="Mocktail">Mocktail</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold mb-2 text-coffee-800">
                                                        Difficulty *
                                                    </label>
                                                    <select
                                                        value={formData.difficulty}
                                                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                                        className="search-input"
                                                    >
                                                        <option value="Easy">Easy</option>
                                                        <option value="Medium">Medium</option>
                                                        <option value="Hard">Hard</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold mb-2 text-coffee-800">
                                                        Prep Time (minutes) *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        required
                                                        value={formData.prepTime}
                                                        onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                                                        className="search-input"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold mb-2 text-coffee-800">
                                                        Calories (optional)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={formData.calories}
                                                        onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                                                        className="search-input"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold mb-2 text-coffee-800">
                                                    Images
                                                </label>
                                                <ImageUpload
                                                    value={formData.images}
                                                    onChange={(value) => setFormData({ ...formData, images: value })}
                                                    multiple={true}
                                                    maxImages={10}
                                                />
                                                <p className="text-xs text-coffee-600/60 mt-2">
                                                    Upload images from your computer or enter URLs below
                                                </p>
                                                
                                                {/* Manual URL input (optional) */}
                                                <div className="mt-4">
                                                    <label className="block text-sm font-semibold mb-2 text-coffee-800">
                                                        Or enter Image URLs manually (one per line)
                                                    </label>
                                                    <textarea
                                                        value={formData.images}
                                                        onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                                                        placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                                                        rows={3}
                                                        className="search-input font-mono text-sm"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold mb-2 text-coffee-800">
                                                    Ingredients (Format: name|amount|unit, one per line) *
                                                </label>
                                                <textarea
                                                    required
                                                    value={formData.ingredients}
                                                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                                                    rows={4}
                                                    placeholder="Espresso Coffee|18|g&#10;Whole Milk|150|ml"
                                                    className="search-input font-mono text-sm"
                                                />
                                                <p className="text-xs text-coffee-600/60 mt-1">
                                                    Format: Name | Amount | Unit (one per line)
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold mb-2 text-coffee-800">
                                                    Instructions (one per line) *
                                                </label>
                                                <textarea
                                                    required
                                                    value={formData.instructions}
                                                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                                    rows={6}
                                                    placeholder="Step 1: Boil water&#10;Step 2: Add coffee..."
                                                    className="search-input font-mono text-sm"
                                                />
                                            </div>

                                            <div className="flex gap-4 pt-4">
                                                <motion.button
                                                    type="submit"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="btn-primary flex items-center gap-2 flex-1"
                                                >
                                                    <Save size={20} />
                                                    {editingRecipe ? 'Update Recipe' : 'Create Recipe'}
                                                </motion.button>
                                                <button
                                                    type="button"
                                                    onClick={resetForm}
                                                    className="btn-secondary flex-1"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Recipes List */}
                        {loading ? (
                            <div className="text-center py-20">
                                <div className="animate-pulse text-coffee-600/60">Loading recipes...</div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recipes.map((recipe, index) => (
                                    <motion.div
                                        key={recipe._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="glass-card p-6"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-forest-800/10 rounded-lg text-forest-800">
                                                    {getCategoryIcon(recipe.category)}
                                                </div>
                                                <div>
                                                    <h3 className="font-serif font-bold text-lg text-coffee-900">
                                                        {recipe.title}
                                                    </h3>
                                                    <p className="text-sm text-coffee-600/60">
                                                        {recipe.category}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-coffee-800/70 mb-4 line-clamp-2">
                                            {recipe.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-coffee-600/60 mb-4">
                                            <span>{recipe.prepTime} min</span>
                                            <span>•</span>
                                            <span className="capitalize">{recipe.difficulty}</span>
                                        </div>
                                        <div className="flex gap-2 pt-4 border-t border-coffee-900/10">
                                            <button
                                                onClick={() => handleEdit(recipe)}
                                                className="flex-1 btn-secondary text-sm flex items-center justify-center gap-2"
                                            >
                                                <Edit size={16} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(recipe._id)}
                                                className="flex-1 btn-secondary text-sm flex items-center justify-center gap-2 text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {!loading && recipes.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-coffee-600/60 text-lg mb-4">No recipes yet</p>
                                <button
                                    onClick={() => {
                                        setShowForm(true);
                                        setActiveTab('recipes');
                                    }}
                                    className="btn-primary"
                                >
                                    Create Your First Recipe
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Users Management Tab */}
                {activeTab === 'users' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {/* User Statistics */}
                        {userStats && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard
                                    icon={Users}
                                    title="Total Users"
                                    value={userStats.total}
                                    subtitle={`${userStats.byRole?.admin || 0} Admins, ${userStats.byRole?.user || 0} Users`}
                                    color="forest"
                                />
                                <StatCard
                                    icon={UserCheck}
                                    title="Active Users"
                                    value={userStats.byStatus?.active || 0}
                                    subtitle={`${userStats.byStatus?.inactive || 0} Inactive`}
                                    color="coffee"
                                />
                                <StatCard
                                    icon={TrendingUp}
                                    title="New (7 days)"
                                    value={userStats.recent?.last7Days || 0}
                                    subtitle={`${userStats.recent?.last30Days || 0} in last 30 days`}
                                    color="forest"
                                />
                                <StatCard
                                    icon={Shield}
                                    title="Admins"
                                    value={userStats.byRole?.admin || 0}
                                    subtitle={`${userStats.byRole?.user || 0} Regular users`}
                                    color="coffee"
                                />
                            </div>
                        )}

                        {/* Filters and Search */}
                        <div className="glass-card p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-600" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Search by username or email..."
                                            value={userFilters.search}
                                            onChange={(e) => {
                                                setUserFilters({ ...userFilters, search: e.target.value });
                                                setUserPagination({ ...userPagination, currentPage: 1 });
                                            }}
                                            className="search-input pl-10"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <select
                                        value={userFilters.role}
                                        onChange={(e) => {
                                            setUserFilters({ ...userFilters, role: e.target.value });
                                            setUserPagination({ ...userPagination, currentPage: 1 });
                                        }}
                                        className="search-input"
                                    >
                                        <option value="">All Roles</option>
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>
                                </div>
                                <div>
                                    <select
                                        value={userFilters.isActive}
                                        onChange={(e) => {
                                            setUserFilters({ ...userFilters, isActive: e.target.value });
                                            setUserPagination({ ...userPagination, currentPage: 1 });
                                        }}
                                        className="search-input"
                                    >
                                        <option value="">All Status</option>
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* User Edit Modal */}
                        <AnimatePresence mode="wait">
                            {showUserForm && editingUser && (
                                <motion.div
                                    key="user-modal-overlay"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-coffee-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                                    onClick={() => {
                                        setShowUserForm(false);
                                        setEditingUser(null);
                                    }}
                                >
                                    <motion.div
                                        key="user-modal-content"
                                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                        animate={{ scale: 1, opacity: 1, y: 0 }}
                                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full"
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-2xl font-serif font-bold text-coffee-900">
                                                Edit User
                                            </h2>
                                            <button
                                                onClick={() => {
                                                    setShowUserForm(false);
                                                    setEditingUser(null);
                                                }}
                                                className="p-2 hover:bg-coffee-900/5 rounded-lg transition-colors"
                                            >
                                                <X size={24} />
                                            </button>
                                        </div>

                                        <form
                                            onSubmit={async (e) => {
                                                e.preventDefault();
                                                try {
                                                    await updateUser(editingUser.id, {
                                                        username: editingUser.username,
                                                        email: editingUser.email,
                                                        role: editingUser.role
                                                    });
                                                    alert('User updated successfully!');
                                                    setShowUserForm(false);
                                                    setEditingUser(null);
                                                    fetchUsers();
                                                    fetchUserStats();
                                                } catch (error) {
                                                    alert(error.response?.data?.message || 'Error updating user');
                                                }
                                            }}
                                            className="space-y-4"
                                        >
                                            <div>
                                                <label className="block text-sm font-semibold mb-2 text-coffee-800">
                                                    Username
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={editingUser.username}
                                                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                                                    className="search-input"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold mb-2 text-coffee-800">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={editingUser.email}
                                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                                    className="search-input"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold mb-2 text-coffee-800">
                                                    Role
                                                </label>
                                                <select
                                                    value={editingUser.role}
                                                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                                    className="search-input"
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </div>

                                            <div className="flex gap-4 pt-4">
                                                <motion.button
                                                    type="submit"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="btn-primary flex items-center gap-2 flex-1"
                                                >
                                                    <Save size={20} />
                                                    Update User
                                                </motion.button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowUserForm(false);
                                                        setEditingUser(null);
                                                    }}
                                                    className="btn-secondary flex-1"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Users List */}
                        {usersLoading ? (
                            <div className="text-center py-20">
                                <div className="animate-pulse text-coffee-600/60">Loading users...</div>
                            </div>
                        ) : (
                            <>
                                <div className="glass-card p-6">
                                    <div className="space-y-4">
                                        {users.map((userItem, index) => (
                                            <motion.div
                                                key={userItem.id || userItem._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="flex items-center justify-between p-4 bg-cream-50 rounded-lg hover:bg-cream-100 transition-colors"
                                            >
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className={`p-3 rounded-lg ${
                                                        userItem.role === 'admin' 
                                                            ? 'bg-forest-800/10 text-forest-800' 
                                                            : 'bg-coffee-800/10 text-coffee-800'
                                                    }`}>
                                                        {userItem.role === 'admin' ? (
                                                            <Shield size={24} />
                                                        ) : (
                                                            <UserIcon size={24} />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-semibold text-coffee-900">
                                                                {userItem.username}
                                                            </h3>
                                                            {userItem.role === 'admin' && (
                                                                <span className="px-2 py-0.5 text-xs bg-forest-800/10 text-forest-800 rounded">
                                                                    Admin
                                                                </span>
                                                            )}
                                                            {!userItem.isActive && (
                                                                <span className="px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded">
                                                                    Inactive
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-coffee-600/60">{userItem.email}</p>
                                                        <p className="text-xs text-coffee-600/40 mt-1">
                                                            Joined: {new Date(userItem.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingUser({
                                                                id: userItem.id || userItem._id,
                                                                username: userItem.username,
                                                                email: userItem.email,
                                                                role: userItem.role
                                                            });
                                                            setShowUserForm(true);
                                                        }}
                                                        className="btn-secondary text-sm flex items-center gap-2"
                                                    >
                                                        <Edit size={16} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (!window.confirm(`Are you sure you want to ${userItem.isActive ? 'deactivate' : 'activate'} this user?`)) {
                                                                return;
                                                            }
                                                            try {
                                                                await toggleUserStatus(userItem.id || userItem._id);
                                                                fetchUsers();
                                                                fetchUserStats();
                                                            } catch (error) {
                                                                alert(error.response?.data?.message || 'Error toggling user status');
                                                            }
                                                        }}
                                                        className={`btn-secondary text-sm flex items-center gap-2 ${
                                                            userItem.isActive 
                                                                ? 'text-orange-600 hover:bg-orange-50' 
                                                                : 'text-green-600 hover:bg-green-50'
                                                        }`}
                                                    >
                                                        {userItem.isActive ? (
                                                            <>
                                                                <UserX size={16} />
                                                                Deactivate
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserCheck size={16} />
                                                                Activate
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
                                                                return;
                                                            }
                                                            try {
                                                                await deleteUser(userItem.id || userItem._id);
                                                                alert('User deleted successfully!');
                                                                fetchUsers();
                                                                fetchUserStats();
                                                            } catch (error) {
                                                                alert(error.response?.data?.message || 'Error deleting user');
                                                            }
                                                        }}
                                                        className="btn-secondary text-sm flex items-center gap-2 text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 size={16} />
                                                        Delete
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {userPagination.totalPages > 1 && (
                                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-coffee-900/10">
                                            <p className="text-sm text-coffee-600/60">
                                                Showing {((userPagination.currentPage - 1) * 10) + 1} to {Math.min(userPagination.currentPage * 10, userPagination.totalUsers)} of {userPagination.totalUsers} users
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setUserPagination({ ...userPagination, currentPage: userPagination.currentPage - 1 })}
                                                    disabled={userPagination.currentPage === 1}
                                                    className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    onClick={() => setUserPagination({ ...userPagination, currentPage: userPagination.currentPage + 1 })}
                                                    disabled={userPagination.currentPage >= userPagination.totalPages}
                                                    className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {!usersLoading && users.length === 0 && (
                                    <div className="text-center py-20">
                                        <p className="text-coffee-600/60 text-lg">No users found</p>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
