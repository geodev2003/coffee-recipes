import axios from 'axios';
import { getAuthToken } from '../utils/auth';

// Detect environment and set API URL
const isProduction = import.meta.env.PROD;
const isVercel = typeof window !== 'undefined' && 
  (window.location.hostname.includes('vercel.app') || 
   window.location.hostname.includes('vercel.com'));

// Use relative path for production/Vercel, absolute for development
const API_URL = (isProduction || isVercel) 
  ? '/api/v1'  // Relative path - Vercel will route to backend
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1');

const api = axios.create({
    baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('brewvibe_token');
            localStorage.removeItem('brewvibe_user');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

export const getRecipes = async (search = '', category = 'All', filters = {}, page = 1, limit = 12) => {
    try {
        const response = await api.get(`/recipes`, {
            params: { 
                search, 
                category,
                ...filters,
                page,
                limit
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching recipes", error);
        return { recipes: [], pagination: { currentPage: 1, totalPages: 1, totalRecipes: 0 } };
    }
};

export const getFeaturedRecipes = async (limit = 6) => {
    try {
        const response = await api.get(`/recipes`, {
            params: { featured: 'true', limit, sort: 'popular' }
        });
        return response.data.recipes || [];
    } catch (error) {
        console.error("Error fetching featured recipes", error);
        return [];
    }
};

export const getRecipeById = async (id) => {
    try {
        const response = await api.get(`/recipes/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching recipe details", error);
        return null;
    }
}

export const getRelatedRecipes = async (id, limit = 4) => {
    try {
        const response = await api.get(`/recipes/${id}/related`, {
            params: { limit }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching related recipes", error);
        return [];
    }
}

export const createRecipe = async (recipeData) => {
    try {
        const response = await api.post('/recipes', recipeData);
        return response.data;
    } catch (error) {
        console.error("Error creating recipe", error);
        throw error;
    }
}

export const updateRecipe = async (id, recipeData) => {
    try {
        const response = await api.put(`/recipes/${id}`, recipeData);
        return response.data;
    } catch (error) {
        console.error("Error updating recipe", error);
        throw error;
    }
}

export const deleteRecipe = async (id) => {
    try {
        const response = await api.delete(`/recipes/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting recipe", error);
        throw error;
    }
}

// Auth API
export const login = async (username, password) => {
    try {
        const response = await api.post('/auth/login', { username, password });
        console.log('Login response:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error logging in", error);
        console.error("Error response:", error.response?.data);
        throw error;
    }
};

export const register = async (username, email, password) => {
    try {
        const response = await api.post('/auth/register', { username, email, password });
        return response.data;
    } catch (error) {
        console.error("Error registering", error);
        throw error;
    }
};

export const getMe = async () => {
    try {
        const response = await api.get('/auth/me');
        return response.data;
    } catch (error) {
        console.error("Error getting user", error);
        throw error;
    }
};

// Statistics API
export const getDashboardStats = async () => {
    try {
        const response = await api.get('/statistics/dashboard');
        return response.data;
    } catch (error) {
        console.error("Error fetching stats", error);
        throw error;
    }
};

export const trackView = async (recipeId) => {
    try {
        await api.post(`/statistics/view/${recipeId}`);
    } catch (error) {
        // Silent fail for tracking
        console.error("Error tracking view", error);
    }
};

export const trackVisitor = async (path = '/') => {
    try {
        const sessionId = localStorage.getItem('brewvibe_session') || `session_${Date.now()}`;
        if (!localStorage.getItem('brewvibe_session')) {
            localStorage.setItem('brewvibe_session', sessionId);
        }
        await api.post(`/statistics/visitor?path=${encodeURIComponent(path)}&sessionId=${sessionId}`);
    } catch (error) {
        // Silent fail for tracking
        console.error("Error tracking visitor", error);
    }
};

// User Auth API
export const userRegister = async (username, email, password) => {
    try {
        const response = await api.post('/users/register', { username, email, password });
        return response.data;
    } catch (error) {
        console.error("Error registering user", error);
        throw error;
    }
};

export const userLogin = async (username, password) => {
    try {
        const response = await api.post('/users/login', { username, password });
        return response.data;
    } catch (error) {
        console.error("Error logging in user", error);
        throw error;
    }
};

export const getUserProfile = async () => {
    try {
        const response = await api.get('/users/profile');
        return response.data;
    } catch (error) {
        console.error("Error getting user profile", error);
        throw error;
    }
};

export const updateUserProfile = async (username, email) => {
    try {
        const response = await api.put('/users/profile', { username, email });
        return response.data;
    } catch (error) {
        console.error("Error updating profile", error);
        throw error;
    }
};

// Wishlist API
export const getWishlist = async () => {
    try {
        const response = await api.get('/wishlist');
        return response.data;
    } catch (error) {
        console.error("Error fetching wishlist", error);
        throw error;
    }
};

export const addToWishlist = async (recipeId) => {
    try {
        const response = await api.post(`/wishlist/${recipeId}`);
        return response.data;
    } catch (error) {
        console.error("Error adding to wishlist", error);
        throw error;
    }
};

export const removeFromWishlist = async (recipeId) => {
    try {
        const response = await api.delete(`/wishlist/${recipeId}`);
        return response.data;
    } catch (error) {
        console.error("Error removing from wishlist", error);
        throw error;
    }
};

export const checkWishlist = async (recipeId) => {
    try {
        const response = await api.get(`/wishlist/check/${recipeId}`);
        return response.data;
    } catch (error) {
        console.error("Error checking wishlist", error);
        return { inWishlist: false };
    }
};

// Comments API
export const getComments = async (recipeId, page = 1, limit = 10) => {
    try {
        const response = await api.get(`/comments/recipe/${recipeId}`, {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching comments", error);
        throw error;
    }
};

export const createComment = async (recipeId, content, rating = null) => {
    try {
        const response = await api.post(`/comments/recipe/${recipeId}`, { content, rating });
        return response.data;
    } catch (error) {
        console.error("Error creating comment", error);
        throw error;
    }
};

export const updateComment = async (commentId, content, rating = null) => {
    try {
        const response = await api.put(`/comments/${commentId}`, { content, rating });
        return response.data;
    } catch (error) {
        console.error("Error updating comment", error);
        throw error;
    }
};

export const deleteComment = async (commentId) => {
    try {
        const response = await api.delete(`/comments/${commentId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting comment", error);
        throw error;
    }
};

export const toggleCommentLike = async (commentId) => {
    try {
        const response = await api.post(`/comments/${commentId}/like`);
        return response.data;
    } catch (error) {
        console.error("Error toggling like", error);
        throw error;
    }
};

export const addReply = async (commentId, content) => {
    try {
        const response = await api.post(`/comments/${commentId}/reply`, { content });
        return response.data;
    } catch (error) {
        console.error("Error adding reply", error);
        throw error;
    }
};

// Upload API
export const uploadImage = async (file) => {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post('/upload/single', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading image", error);
        throw error;
    }
};

export const uploadImages = async (files) => {
    try {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('images', file);
        });

        const response = await api.post('/upload/multiple', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading images", error);
        throw error;
    }
};

export default api;
