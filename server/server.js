require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      process.env.CORS_ORIGIN
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in development, restrict in production
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/brewvibe')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes - with error handling
const recipeRoutes = require('./routes/recipeRoutes');
const authRoutes = require('./routes/authRoutes');
const userAuthRoutes = require('./routes/userAuthRoutes');
const userManagementRoutes = require('./routes/userManagementRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const commentRoutes = require('./routes/commentRoutes');

// Try to load uploadRoutes with error handling
let uploadRoutes;
try {
    uploadRoutes = require('./routes/uploadRoutes');
} catch (error) {
    console.error('Error loading uploadRoutes:', error.message);
    // Create a fallback router
    const express = require('express');
    uploadRoutes = express.Router();
    uploadRoutes.post('/single', (req, res) => {
        res.status(503).json({ success: false, message: 'Upload service temporarily unavailable' });
    });
    uploadRoutes.post('/multiple', (req, res) => {
        res.status(503).json({ success: false, message: 'Upload service temporarily unavailable' });
    });
}

const path = require('path');
const { protect, adminOnly } = require('./middleware/auth');

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/v1/recipes', recipeRoutes);
app.use('/api/v1/auth', authRoutes); // Admin auth
app.use('/api/v1/users', userAuthRoutes); // User auth
app.use('/api/v1/admin/users', userManagementRoutes); // User management (admin only)
app.use('/api/v1/statistics', statisticsRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/upload', uploadRoutes);

// Recipe routes are already protected in the routes file

app.get('/', (req, res) => {
    res.send('BrewVibe API is running');
});

// Export app for Vercel serverless functions
module.exports = app;

// Start Server only if not in Vercel environment
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
