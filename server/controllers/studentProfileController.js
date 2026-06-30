const StudentProfile = require('../models/StudentProfile');
const Joi = require('joi');
const logger = require('../utils/logger');

// Validation schemas
const createProfileSchema = Joi.object({
  marks: Joi.number().required().min(0).max(100),
  declared_interest: Joi.string().required().valid('Science', 'Commerce', 'Arts'),
  academic_details: Joi.object({
    class_10_marks: Joi.number().min(0).max(100).allow(null),
    class_12_marks: Joi.number().min(0).max(100).allow(null),
    board: Joi.string().allow('').allow(null),
    year_of_passing: Joi.number().min(2000).max(new Date().getFullYear()).allow(null)
  }).optional(),
  personal_details: Joi.object({
    date_of_birth: Joi.date().allow(null),
    gender: Joi.string().valid('Male', 'Female', 'Other', '').allow(null),
    city: Joi.string().allow('').allow(null),
    state: Joi.string().allow('').allow(null),
    country: Joi.string().allow('').allow(null),
    phone_number: Joi.string().allow('').allow(null),
    parent_name: Joi.string().allow('').allow(null),
    parent_occupation: Joi.string().allow('').allow(null),
    family_income: Joi.string().allow('').allow(null),
    blood_group: Joi.string().allow('').allow(null),
    nationality: Joi.string().allow('').allow(null),
    languages_known: Joi.string().allow('').allow(null),
    hobbies: Joi.string().allow('').allow(null),
    strengths: Joi.string().allow('').allow(null),
    career_goals: Joi.string().allow('').allow(null)
  }).optional()
});

// Create or update student profile
const createProfile = async (req, res) => {
  try {
    logger.info('Profile creation attempt started');
    logger.info('Request object keys:', Object.keys(req));
    logger.info('Request body:', JSON.stringify(req.body, null, 2));
    logger.info('User object present:', !!req.user);
    logger.info('User ID:', req.user?._id);
    logger.info('User email:', req.user?.email);
    logger.info('Full user object:', JSON.stringify(req.user, null, 2));

    const { error, value } = createProfileSchema.validate(req.body);
    if (error) {
      logger.error('Validation error:', error.details);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    logger.info('Validation passed, value:', JSON.stringify(value, null, 2));

    const userId = req.user._id;

    // Check if profile already exists
    let profile = await StudentProfile.findOne({ userId });
    logger.info('Existing profile found:', !!profile);

    if (profile) {
      // Update existing profile
      Object.assign(profile, value);
      await profile.save();
      logger.info('Profile updated successfully');
    } else {
      // Create new profile
      profile = new StudentProfile({
        userId,
        ...value
      });
      await profile.save();
      logger.info('New profile created successfully');
    }

    logger.info(`Student profile created/updated for user: ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: profile.isNew ? 'Profile created successfully' : 'Profile updated successfully',
      data: profile
    });
  } catch (error) {
    logger.error('Create/update profile error:', error);
    logger.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to save profile',
      error: error.message
    });
  }
};

// Get student profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await StudentProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
};

// Update student profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    logger.info(`Student profile updated for user: ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// Delete student profile
const deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await StudentProfile.findOneAndDelete({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    logger.info(`Student profile deleted for user: ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    logger.error('Delete profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete profile',
      error: error.message
    });
  }
};

// Get profile summary
const getProfileSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await StudentProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    const summary = {
      marks: profile.marks,
      declared_interest: profile.declared_interest,
      dominant_domain: profile.dominant_domain,
      quiz_completed: profile.quiz_completed,
      has_academic_details: !!profile.academic_details,
      has_personal_details: !!profile.personal_details
    };

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    logger.error('Get profile summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile summary',
      error: error.message
    });
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  getProfileSummary
};
