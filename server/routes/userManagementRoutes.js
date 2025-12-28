const express = require('express');
const router = express.Router();
const userManagementController = require('../controllers/userManagementController');
const { protect, adminOnly } = require('../middleware/auth');

// All routes require admin authentication
router.use(protect, adminOnly);

// Get user statistics
router.get('/stats', userManagementController.getUserStats);

// Get all users (with pagination and filters)
router.get('/', userManagementController.getAllUsers);

// Get user by ID
router.get('/:id', userManagementController.getUserById);

// Update user
router.put('/:id', userManagementController.updateUser);

// Toggle user status (activate/deactivate)
router.patch('/:id/toggle-status', userManagementController.toggleUserStatus);

// Delete user
router.delete('/:id', userManagementController.deleteUser);

module.exports = router;

