const logger = require('../utils/logger');

const errorHandler = (error, req, res, next) => {
  let err = { ...error };
  err.message = error.message;

  // Log error
  logger.error({
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const message = Object.values(error.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: message
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const message = `${field} already exists`;
    return res.status(400).json({
      success: false,
      message: 'Duplicate Entry',
      field,
      error: message
    });
  }

  // Mongoose cast error
  if (error.name === 'CastError') {
    const message = 'Resource not found';
    return res.status(404).json({
      success: false,
      message,
      error: 'Invalid ID format'
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    return res.status(401).json({
      success: false,
      message,
      error: 'Please login again'
    });
  }

  if (error.name === 'TokenExpiredError') {
    const message = 'Token expired';
    return res.status(401).json({
      success: false,
      message,
      error: 'Please login again'
    });
  }

  // Network/timeout errors
  if (error.code === 'ECONNREFUSED') {
    return res.status(503).json({
      success: false,
      message: 'Service unavailable',
      error: 'Database connection failed'
    });
  }

  if (error.code === 'ETIMEDOUT') {
    return res.status(504).json({
      success: false,
      message: 'Request timeout',
      error: 'Service took too long to respond'
    });
  }

  // LLM API errors
  if (error.message && error.message.includes('OpenAI')) {
    return res.status(503).json({
      success: false,
      message: 'AI service unavailable',
      error: 'Unable to generate recommendations at this time'
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error.stack : 'Something went wrong'
  });
};

module.exports = errorHandler;
