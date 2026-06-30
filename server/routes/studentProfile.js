const express = require('express');
const router = express.Router();
const {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  getProfileSummary
} = require('../controllers/studentProfileController');
const { authenticate } = require('../middleware/auth');

// POST /api/profile - Create student profile
router.post('/', authenticate, createProfile);

// GET /api/profile - Get student profile
router.get('/', authenticate, getProfile);

// GET /api/profile/summary - Get profile summary
router.get('/summary', authenticate, getProfileSummary);

// PUT /api/profile - Update student profile
router.put('/', authenticate, updateProfile);

// DELETE /api/profile - Delete student profile
router.delete('/', authenticate, deleteProfile);

module.exports = router;
