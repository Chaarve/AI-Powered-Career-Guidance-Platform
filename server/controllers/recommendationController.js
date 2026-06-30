const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');
const Course = require('../models/Course');
const College = require('../models/College');
const Recommendation = require('../models/Recommendation');
const llmService = require('../services/llmService');
const logger = require('../utils/logger');

const generateRecommendations = async (req, res) => {
  try {
    logger.info('=== RECOMMENDATION GENERATION STARTED ===');
    const userId = req.user._id;
    logger.info(`User ID: ${userId}`);
    logger.info(`User email: ${req.user.email}`);

    // Find student profile
    logger.info('Finding student profile...');
    const profile = await StudentProfile.findOne({ userId });
    if (!profile) {
      logger.error('ERROR: Student profile not found');
      return res.status(404).json({
        success: false,
        message: 'Student profile not found. Please create your profile first.'
      });
    }

    logger.info('Student profile found:');
    logger.info(`  - Marks: ${profile.marks}`);
    logger.info(`  - Interest: ${profile.declared_interest}`);
    logger.info(`  - Quiz completed: ${profile.quiz_completed}`);
    logger.info(`  - Dominant domain: ${profile.dominant_domain}`);
    logger.info(`  - Aptitude scores: ${JSON.stringify(profile.aptitude_scores)}`);

    // Check if quiz is completed
    if (!profile.quiz_completed) {
      logger.error('ERROR: Quiz not completed');
      return res.status(400).json({
        success: false,
        message: 'Please complete the quiz first to get recommendations.'
      });
    }

    // Check if recommendations already exist (cache for 24 hours)
    const existingRecommendation = await Recommendation.findLatestByStudent(userId);
    if (existingRecommendation && 
        (Date.now() - existingRecommendation.created_at.getTime()) < 24 * 60 * 60 * 1000) {
      return res.status(200).json({
        success: true,
        message: 'Using existing recommendations',
        data: existingRecommendation
      });
    }

    // Get user info for personalization
    const user = await User.findById(userId);

    // Calculate age from DOB if available
    let age = null;
    if (profile.personal_details && profile.personal_details.date_of_birth) {
      const dob = new Date(profile.personal_details.date_of_birth);
      const today = new Date();
      age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      logger.info(`  - Age: ${age}`);
    }

    // Get hobbies and career goals
    const hobbies = profile.personal_details?.hobbies || '';
    const careerGoals = profile.personal_details?.career_goals || '';
    logger.info(`  - Hobbies: ${hobbies}`);
    logger.info(`  - Career Goals: ${careerGoals}`);

    // STEP 1: Send profile to Python Machine Learning Microservice
    logger.info('STEP 1: Forwarding student profile to Python ML Server for predictions...');
    
    const studentProfilePayload = {
      name: user.name,
      marks: profile.marks,
      declared_interest: profile.declared_interest,
      aptitude_scores: profile.aptitude_scores,
      dominant_domain: profile.dominant_domain,
      age: age,
      hobbies: hobbies,
      career_goals: careerGoals
    };

    let finalRecommendations = [];
    let recommendationType = 'hybrid';
    let mlSuccess = false;
    let mlProcessingTime = 0;
    
    // We import axios locally here for the bridge
    const axios = require('axios');
    const startTime = Date.now();

    try {
      const mlResponse = await axios.post('http://127.0.0.1:5001/api/recommend', studentProfilePayload, {
        timeout: 10000 // 10 second timeout for ML inference
      });
      
      mlProcessingTime = Date.now() - startTime;
      
      if (mlResponse.data && mlResponse.data.success) {
        finalRecommendations = mlResponse.data.recommendations;
        mlSuccess = true;
        logger.info(`ML Server responded with ${finalRecommendations.length} recommendations in ${mlProcessingTime}ms`);
      } else {
        throw new Error(mlResponse.data ? mlResponse.data.message : 'Unknown ML Server Error');
      }
    } catch (mlError) {
      logger.error('CRITICAL ML ERROR: Failed to reach Python server or inference failed:', mlError.message);
      mlProcessingTime = Date.now() - startTime;
      mlSuccess = false;
      recommendationType = 'rule_based';
      
      // Fallback if Python ML server is down
      const llmService = require('../services/llmService');
      const College = require('../models/College');
      
      // Get all unique courses as fallback payload
      const eligibleCoursesAggregate = await College.aggregate([
        { $unwind: "$courses" },
        { 
          $group: { 
            _id: "$courses.name",
            name: { $first: "$courses.name" },
            level: { $first: "$courses.level" },
            duration: { $first: "$courses.duration" },
            mode: { $first: "$courses.mode" },
            feeRange: { $first: "$courses.feesRaw" },
            count: { $sum: 1 }
          } 
        },
        { $sort: { count: -1 } },
        { $limit: 100 }
      ]);
      
      finalRecommendations = llmService.generateFallbackRecommendations(studentProfilePayload, eligibleCoursesAggregate);
    }

    // STEP 2: Map to recommendation objects
    const recommendationsWithDetails = finalRecommendations.map(rec => {
      return {
        course_name: rec.course,
        course_level: rec.level || 'Degree Program',
        course_duration: '3-4 years', // Standard
        reason: rec.reason,
        score: rec.score || 0,
        rank: rec.rank || 0
      };
    }).filter(rec => rec.course_name !== null);

    logger.info('STEP 3: Creating recommendation document...');
    logger.info(`Recommended courses count: ${recommendationsWithDetails.length}`);
    
    const recommendation = new Recommendation({
      student_id: userId,
      recommended_courses: recommendationsWithDetails,
      aptitude_profile: {
        science: profile.aptitude_scores.science,
        commerce: profile.aptitude_scores.commerce,
        arts: profile.aptitude_scores.arts,
        dominant_domain: profile.dominant_domain
      },
      student_profile: {
        marks: profile.marks,
        declared_interest: profile.declared_interest
      },
      recommendation_type: recommendationType,
      llm_response: {
        raw_response: null,
        processing_time: mlProcessingTime,
        success: mlSuccess,
        error_message: null
      },
      total_courses_filtered: 100,
      total_courses_recommended: recommendationsWithDetails.length
    });

    await recommendation.save();

    // STEP 5: Return recommendations
    // recommendation is already completely self contained
    const populatedRecommendation = recommendation;

    logger.info(`Recommendations generated for user: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Recommendations generated successfully',
      data: populatedRecommendation
    });

  } catch (error) {
    logger.error('Error generating recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations',
      error: error.message
    });
  }
};

const getStudentRecommendations = async (req, res) => {
  try {
    logger.info('=== FETCHING RECOMMENDATIONS STARTED ===');
    const userId = req.user._id;
    logger.info(`User ID: ${userId}`);
    logger.info(`User email: ${req.user.email}`);

    logger.info('Looking for recommendations for user...');
    const recommendations = await Recommendation.findByStudent(userId);
    logger.info(`Found ${recommendations.length} recommendations`);

    if (recommendations.length === 0) {
      logger.error('ERROR: No recommendations found for user');
      return res.status(404).json({
        success: false,
        message: 'No recommendations found. Please complete the quiz first.'
      });
    }

    logger.info('Recommendations found successfully:');
    recommendations.forEach((rec, index) => {
      logger.info(`  ${index + 1}. ID: ${rec._id}, Courses: ${rec.recommended_courses ? rec.recommended_courses.length : 0}`);
    });

    res.status(200).json({
      success: true,
      data: {
        recommendations: recommendations,
        total_recommendations: recommendations.length
      }
    });
  } catch (error) {
    logger.error('Error fetching recommendations:', error);
    logger.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations',
      error: error.message
    });
  }
};

const getLatestRecommendation = async (req, res) => {
  try {
    const userId = req.user._id;

    const recommendation = await Recommendation.findLatestByStudent(userId);

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'No recommendations found. Please complete the quiz first.'
      });
    }

    res.status(200).json({
      success: true,
      data: recommendation
    });
  } catch (error) {
    logger.error('Error fetching latest recommendation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch latest recommendation',
      error: error.message
    });
  }
};

const deleteRecommendation = async (req, res) => {
  try {
    const { recommendationId } = req.params;
    const userId = req.user._id;

    // Find recommendation and ensure it belongs to the user
    const recommendation = await Recommendation.findOne({ 
      _id: recommendationId, 
      student_id: userId 
    });
    
    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found'
      });
    }

    await Recommendation.findByIdAndDelete(recommendationId);

    logger.info(`Recommendation deleted by user: ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Recommendation deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting recommendation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete recommendation',
      error: error.message
    });
  }
};

module.exports = {
  generateRecommendations,
  getStudentRecommendations,
  getLatestRecommendation,
  deleteRecommendation
};
