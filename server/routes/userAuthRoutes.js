const express = require('express');
const router = express.Router();
const userAuthController = require('../controllers/userAuthController');
const { protect } = require('../middleware/auth');

router.post('/register', userAuthController.register);
router.post('/login', userAuthController.login);
router.get('/profile', protect, userAuthController.getProfile);
router.put('/profile', protect, userAuthController.updateProfile);

module.exports = router;

