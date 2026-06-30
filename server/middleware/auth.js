const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    logger.info(`Auth middleware - Auth header: ${authHeader ? 'Present' : 'Missing'}`);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.error('Auth middleware - No token provided');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    logger.info(`Auth middleware - Token extracted: ${token ? 'Present' : 'Missing'}`);
    logger.info(`Auth middleware - JWT_SECRET: ${process.env.JWT_SECRET ? 'Set' : 'Missing'}`);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    logger.info(`Auth middleware - Token decoded successfully for user: ${decoded.userId}`);
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      logger.error('Auth middleware - User not found');
      return res.status(401).json({
        success: false,
        message: 'Token is valid but user not found.'
      });
    }

    logger.info(`Auth middleware - User found: ${user.email}`);
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    } else {
      logger.error('Authentication error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error during authentication.'
      });
    }
  }
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (user) {
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Optional auth doesn't fail, just continues without user
    next();
  }
};

// Check if user has completed profile
const hasProfile = async (req, res, next) => {
  try {
    const StudentProfile = require('../models/StudentProfile');
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    
    if (!profile) {
      return res.status(403).json({
        success: false,
        message: 'Please complete your profile first.'
      });
    }
    
    req.profile = profile;
    next();
  } catch (error) {
    logger.error('Profile check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error checking profile.'
    });
  }
};

// Check if user has completed quiz
const hasCompletedQuiz = async (req, res, next) => {
  try {
    const StudentProfile = require('../models/StudentProfile');
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    
    if (!profile || !profile.quiz_completed) {
      return res.status(403).json({
        success: false,
        message: 'Please complete the quiz first.'
      });
    }
    
    req.profile = profile;
    next();
  } catch (error) {
    logger.error('Quiz completion check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error checking quiz status.'
    });
  }
};

module.exports = {
  authenticate,
  optionalAuth,
  hasProfile,
  hasCompletedQuiz
};
