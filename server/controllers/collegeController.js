const College = require('../models/College');
const Course = require('../models/Course');
const Joi = require('joi');

const getColleges = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      state, 
      district, 
      college_type,
      courseId 
    } = req.query;

    let query = {};

    // Build query based on filters
    if (state) query['location.state'] = state;
    if (district) query['location.city'] = district;
    if (college_type) query.type = college_type;
    if (courseId) query['courses.name'] = { $regex: courseId, $options: 'i' };

    const colleges = await College.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 });

    const total = await College.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        colleges,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / limit),
          total_colleges: total,
          per_page: parseInt(limit)
        },
        filters: {
          state,
          district,
          college_type,
          courseId
        }
      }
    });
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch colleges'
    });
  }
};

const getCollegesByCourse = async (req, res) => {
  try {
    const { courseId, page = 1, limit = 10 } = req.query; // courseId is now just the course name string

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course Name is required'
      });
    }

    // Build query for colleges with pagination
    const query = { 'courses.name': { $regex: courseId, $options: 'i' } };
    
    const colleges = await College.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 });

    const total = await College.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        course: {
          id: courseId,
          name: courseId
        },
        colleges,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / limit),
          total_colleges: total,
          per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching colleges by course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch colleges for this course'
    });
  }
};

const getCollegeById = async (req, res) => {
  try {
    const { id } = req.params;

    const college = await College.findById(id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    res.status(200).json({
      success: true,
      data: college
    });
  } catch (error) {
    console.error('Error fetching college:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch college'
    });
  }
};

const getStates = async (req, res) => {
  try {
    const states = await College.distinct('location.state');
    
    // Filter out null or missing values
    const validStates = states.filter(s => s).sort();

    res.status(200).json({
      success: true,
      data: {
        states: validStates,
        total_states: validStates.length
      }
    });
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch states'
    });
  }
};

const getDistrictsByState = async (req, res) => {
  try {
    const { state } = req.params;

    if (!state) {
      return res.status(400).json({
        success: false,
        message: 'State is required'
      });
    }

    const districts = await College.distinct('location.city', { 
      'location.state': state 
    });

    const sortedDistricts = districts.filter(d => d).sort();

    res.status(200).json({
      success: true,
      data: {
        state,
        districts: sortedDistricts,
        total_districts: sortedDistricts.length
      }
    });
  } catch (error) {
    console.error('Error fetching districts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch districts'
    });
  }
};

const searchColleges = async (req, res) => {
  try {
    const { 
      q: query, 
      page = 1, 
      limit = 10,
      state,
      district,
      college_type,
      fee_min,
      fee_max
    } = req.query;

    if (!query && !fee_min && !fee_max) {
      return res.status(400).json({
        success: false,
        message: 'Search query or fee range is required'
      });
    }

    let searchQuery = {};

    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { "location.city": { $regex: query, $options: 'i' } },
        { "location.state": { $regex: query, $options: 'i' } },
        { "courses.name": { $regex: query, $options: 'i' } },
        { type: { $regex: query, $options: 'i' } }
      ];
    }

    // Add fee range filter
    if (fee_min || fee_max) {
      searchQuery['feeRange.min'] = {};
      searchQuery['feeRange.max'] = {};
      if (fee_min) searchQuery['feeRange.min'].$gte = parseInt(fee_min);
      if (fee_max) searchQuery['feeRange.max'].$lte = parseInt(fee_max);
      // Clean up empty objects
      if (Object.keys(searchQuery['feeRange.min']).length === 0) delete searchQuery['feeRange.min'];
      if (Object.keys(searchQuery['feeRange.max']).length === 0) delete searchQuery['feeRange.max'];
    }

    // Add additional filters
    if (state) searchQuery['location.state'] = state;
    if (district) searchQuery['location.city'] = district;
    if (college_type) searchQuery.type = college_type;

    const colleges = await College.find(searchQuery)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 });

    const total = await College.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      data: {
        colleges,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / limit),
          total_colleges: total,
          per_page: parseInt(limit)
        },
        search_query: query,
        filters: {
          state,
          district,
          college_type,
          fee_min,
          fee_max
        }
      }
    });
  } catch (error) {
    console.error('Error searching colleges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search colleges'
    });
  }
};

const getCollegeStats = async (req, res) => {
  try {
    const stats = await Promise.all([
      College.countDocuments({}),
      College.countDocuments({ type: /Government/i }),
      College.countDocuments({ type: /Private/i }),
      College.countDocuments({ type: /Public/i }),
      College.distinct('location.state'),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total_colleges: stats[0],
        by_type: {
          government: stats[1],
          private: stats[2],
          public: stats[3]
        },
        total_states: stats[4].filter(s => s).length,
        facilities: {
          hostel: 0,
          library: 0,
          laboratory: 0,
          sports: 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching college stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch college statistics'
    });
  }
};

module.exports = {
  getColleges,
  getCollegesByCourse,
  getCollegeById,
  getStates,
  getDistrictsByState,
  searchColleges,
  getCollegeStats
};
