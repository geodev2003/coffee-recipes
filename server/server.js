require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/brewvibe')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
const recipeRoutes = require('./routes/recipeRoutes');
const authRoutes = require('./routes/authRoutes');
const userAuthRoutes = require('./routes/userAuthRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const commentRoutes = require('./routes/commentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const path = require('path');
const { protect, adminOnly } = require('./middleware/auth');

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/v1/recipes', recipeRoutes);
app.use('/api/v1/auth', authRoutes); // Admin auth
app.use('/api/v1/users', userAuthRoutes); // User auth
app.use('/api/v1/statistics', statisticsRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/upload', uploadRoutes);

// Recipe routes are already protected in the routes file

app.get('/', (req, res) => {
    res.send('BrewVibe API is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
