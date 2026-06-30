const Joi = require('joi');
const logger = require('../utils/logger');

// Generic validation middleware
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property]);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      logger.warn(`Validation error: ${errorMessage}`);
      
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    req[property] = value;
    next();
  };
};

// Common validation schemas
const schemas = {
  student: Joi.object({
    name: Joi.string().required().min(2).max(100).trim().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters'
    }),
    marks: Joi.number().required().min(0).max(100).messages({
      'number.base': 'Marks must be a number',
      'number.min': 'Marks cannot be less than 0',
      'number.max': 'Marks cannot exceed 100',
      'any.required': 'Marks are required'
    }),
    declared_interest: Joi.string().required().valid('Science', 'Commerce', 'Arts').messages({
      'any.only': 'Interest must be one of: Science, Commerce, Arts',
      'any.required': 'Declared interest is required'
    })
  }),

  quizSubmission: Joi.object({
    student_id: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).messages({
      'string.pattern.base': 'Invalid student ID format',
      'any.required': 'Student ID is required'
    }),
    answers: Joi.array().required().items(
      Joi.object({
        question_id: Joi.number().integer().required().messages({
          'number.base': 'Question ID must be a number',
          'any.required': 'Question ID is required'
        }),
        selected_option_index: Joi.number().integer().required().min(0).messages({
          'number.base': 'Selected option must be a number',
          'number.min': 'Selected option cannot be negative',
          'any.required': 'Selected option is required'
        })
      })
    ).messages({
      'any.required': 'Answers are required'
    })
  }),

  collegeQuery: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    state: Joi.string().trim(),
    district: Joi.string().trim(),
    college_type: Joi.string().valid('Government', 'Private', 'Aided'),
    courseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/)
  }),

  searchQuery: Joi.object({
    q: Joi.string().required().min(1).max(100).trim().messages({
      'string.empty': 'Search query is required',
      'string.min': 'Search query must be at least 1 character long',
      'string.max': 'Search query cannot exceed 100 characters',
      'any.required': 'Search query is required'
    }),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    state: Joi.string().trim(),
    district: Joi.string().trim(),
    college_type: Joi.string().valid('Government', 'Private', 'Aided')
  }),

  mongoId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).messages({
    'string.pattern.base': 'Invalid ID format',
    'any.required': 'ID is required'
  })
};

// Custom validation functions
const validateMongoId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
    
    if (!id || !mongoIdPattern.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
        error: 'ID must be a valid MongoDB ObjectId'
      });
    }
    
    next();
  };
};

const validateQuizAnswers = (answers, questions) => {
  const errors = [];
  
  if (!Array.isArray(answers)) {
    errors.push('Answers must be an array');
    return errors;
  }
  
  if (answers.length !== questions.length) {
    errors.push(`Must answer all ${questions.length} questions`);
    return errors;
  }
  
  answers.forEach((answer, index) => {
    const question = questions.find(q => q.id === answer.question_id);
    
    if (!question) {
      errors.push(`Question ${answer.question_id} not found`);
      return;
    }
    
    if (typeof answer.selected_option_index !== 'number' || 
        answer.selected_option_index < 0 || 
        answer.selected_option_index >= question.options.length) {
      errors.push(`Invalid option selection for question ${answer.question_id}`);
    }
  });
  
  return errors;
};

module.exports = {
  validate,
  schemas,
  validateMongoId,
  validateQuizAnswers
};
