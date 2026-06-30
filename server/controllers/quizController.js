const StudentProfile = require('../models/StudentProfile');
const quizService = require('../services/quizService');
const Joi = require('joi');
const logger = require('../utils/logger');

const answerSchema = Joi.object({
  question_id: Joi.number().integer().required(),
  selected_option_index: Joi.number().integer().required()
});

const submitQuizSchema = Joi.object({
  answers: Joi.array().items(answerSchema).required()
});

const getQuizQuestions = async (req, res) => {
  try {
    const questions = quizService.getQuestions();
    
    const sanitizedQuestions = questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options.map(opt => ({
        text: opt.text
      }))
    }));

    res.status(200).json({
      success: true,
      data: {
        questions: sanitizedQuestions,
        total_questions: questions.length
      }
    });
  } catch (error) {
    logger.error('Error fetching quiz questions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz questions'
    });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { error, value } = submitQuizSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    const { answers } = value;
    const userId = req.user._id;

    // Validate answers
    const validationErrors = quizService.validateAnswers(answers);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid answers',
        errors: validationErrors
      });
    }

    // Find student profile
    let profile = await StudentProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found. Please create your profile first.'
      });
    }

    if (profile.quiz_completed) {
      return res.status(400).json({
        success: false,
        message: 'Quiz already submitted'
      });
    }

    // Calculate scores
    const scores = quizService.calculateScores(answers);
    const dominantDomain = quizService.determineDominantDomain(scores);
    const userForPersonalization = {
      name: req.user?.name,
      email: req.user?.email
    };
    const profileForPersonalization = {
      ...profile.toObject(),
      ...userForPersonalization
    };
    const careerGuidance = quizService.generateCareerGuidance(scores, profileForPersonalization);

    // Update profile with quiz results
    profile.aptitude_scores = scores;
    profile.dominant_domain = dominantDomain;
    profile.quiz_completed = true;
    profile.quiz_answers = answers.map((answer, index) => ({
      question_index: index,
      selected_option: answer.selected_option_index,
      timestamp: new Date()
    }));
    profile.career_guidance = {
      ...careerGuidance,
      generated_at: new Date()
    };

    await profile.save();

    // Generate aptitude report
    const aptitudeReport = quizService.generateAptitudeReport(scores, dominantDomain);

    logger.info(`Quiz submitted by user: ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        aptitude_scores: scores,
        dominant_domain: dominantDomain,
        quiz_completed: true,
        aptitude_report: aptitudeReport,

        // Enhanced career guidance payload (keeps existing structure intact)
        streams: careerGuidance.streams,
        courses: careerGuidance.courses,
        careers: careerGuidance.careers,
        explanation: careerGuidance.explanation,
        scores: careerGuidance.scores,

        career_guidance: careerGuidance
      }
    });
  } catch (error) {
    logger.error('Error submitting quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quiz',
      error: error.message
    });
  }
};

const getQuizResults = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await StudentProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    if (!profile.quiz_completed) {
      return res.status(400).json({
        success: false,
        message: 'Quiz not completed yet'
      });
    }

    const aptitudeReport = quizService.generateAptitudeReport(
      profile.aptitude_scores,
      profile.dominant_domain
    );

    res.status(200).json({
      success: true,
      data: {
        aptitude_scores: profile.aptitude_scores,
        dominant_domain: profile.dominant_domain,
        quiz_completed: profile.quiz_completed,
        quiz_answers: profile.quiz_answers,
        aptitude_report: aptitudeReport,
        career_guidance: profile.career_guidance || null
      }
    });
  } catch (error) {
    logger.error('Error fetching quiz results:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz results',
      error: error.message
    });
  }
};

const resetQuiz = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await StudentProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Reset quiz data
    profile.aptitude_scores = {
      science: 0,
      commerce: 0,
      arts: 0,
      vocational: 0
    };
    profile.dominant_domain = null;
    profile.quiz_completed = false;
    profile.quiz_answers = [];
    profile.career_guidance = {
      streams: [],
      courses: [],
      careers: [],
      explanation: '',
      scores: { science: 0, commerce: 0, arts: 0, vocational: 0 },
      generated_at: null
    };

    await profile.save();

    logger.info(`Quiz reset for user: ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Quiz reset successfully',
      data: {
        quiz_completed: false
      }
    });
  } catch (error) {
    logger.error('Error resetting quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset quiz',
      error: error.message
    });
  }
};

module.exports = {
  getQuizQuestions,
  submitQuiz,
  getQuizResults,
  resetQuiz
};
