const express = require('express');
const router = express.Router();
const {
  getQuizQuestions,
  submitQuiz,
  getQuizResults,
  resetQuiz
} = require('../controllers/quizController');
const { authenticate, hasProfile, hasCompletedQuiz } = require('../middleware/auth');

// GET /api/quiz/questions - Get quiz questions (protected)
router.get('/questions', authenticate, getQuizQuestions);

// POST /api/quiz/submit - Submit quiz answers (protected, requires profile)
router.post('/submit', authenticate, hasProfile, submitQuiz);

// GET /api/quiz/results - Get quiz results for current user (protected, requires quiz completion)
router.get('/results', authenticate, hasCompletedQuiz, getQuizResults);

// POST /api/quiz/reset - Reset quiz for current user (protected)
router.post('/reset', authenticate, resetQuiz);

module.exports = router;
