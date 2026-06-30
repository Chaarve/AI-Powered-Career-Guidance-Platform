const express = require('express');
const router = express.Router();
const {
  getInterestsQuizQuestions,
  getAptitudeQuizQuestions,
  submitInterestsQuiz,
  submitAptitudeQuiz,
  getQuizResults,
  getQuizStatus,
  resetQuizzes,
  getQuizHistory
} = require('../controllers/enhancedQuizController');
const { authenticate } = require('../middleware/auth');

// Get quiz status
router.get('/status', authenticate, getQuizStatus);

// Get quiz history
router.get('/history', authenticate, getQuizHistory);

// Get interests quiz questions
router.get('/interests/questions', authenticate, getInterestsQuizQuestions);

// Submit interests quiz
router.post('/interests/submit', authenticate, submitInterestsQuiz);

// Get aptitude quiz questions
router.get('/aptitude/questions', authenticate, getAptitudeQuizQuestions);

// Submit aptitude quiz
router.post('/aptitude/submit', authenticate, submitAptitudeQuiz);

// Get combined quiz results
router.get('/results', authenticate, getQuizResults);

// Reset all quizzes
router.post('/reset', authenticate, resetQuizzes);

module.exports = router;
