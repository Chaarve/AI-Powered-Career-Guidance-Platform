const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  googleAuth,
  updateProfile,
  logout
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// POST /api/auth/register - Register new user
router.post('/register', register);

// POST /api/auth/login - Login user
router.post('/login', login);

// POST /api/auth/google - Google OAuth
router.post('/google', googleAuth);

// GET /api/auth/profile - Get current user profile (protected)
router.get('/profile', authenticate, getProfile);

// PUT /api/auth/profile - Update user profile (protected)
router.put('/profile', authenticate, updateProfile);

// POST /api/auth/logout - Logout user (protected)
router.post('/logout', authenticate, logout);

module.exports = router;
