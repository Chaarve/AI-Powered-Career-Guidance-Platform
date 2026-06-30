const express = require('express');
const router = express.Router();
const {
  generateRecommendations,
  getStudentRecommendations,
  getLatestRecommendation,
  deleteRecommendation
} = require('../controllers/recommendationController');
const { authenticate, hasCompletedQuiz } = require('../middleware/auth');

// POST /api/recommendations - Generate recommendations for current user
router.post('/', authenticate, hasCompletedQuiz, generateRecommendations);

// GET /api/recommendations - Get all recommendations for current user
router.get('/', authenticate, getStudentRecommendations);

// GET /api/recommendations/latest - Get latest recommendation for current user
router.get('/latest', authenticate, getLatestRecommendation);

// DELETE /api/recommendations/:recommendationId - Delete a specific recommendation
router.delete('/:recommendationId', authenticate, deleteRecommendation);

module.exports = router;
