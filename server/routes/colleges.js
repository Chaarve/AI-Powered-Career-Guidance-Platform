const express = require('express');
const router = express.Router();
const {
  getColleges,
  getCollegesByCourse,
  getCollegeById,
  getStates,
  getDistrictsByState,
  searchColleges,
  getCollegeStats
} = require('../controllers/collegeController');

// GET /api/colleges - Get all colleges with filters and pagination
router.get('/', getColleges);

// GET /api/colleges/search - Search colleges
router.get('/search', searchColleges);

// GET /api/colleges/by-course - Get colleges by course ID
router.get('/by-course', getCollegesByCourse);

// GET /api/colleges/stats - Get college statistics
router.get('/stats', getCollegeStats);

// GET /api/colleges/states - Get all states
router.get('/states', getStates);

// GET /api/colleges/states/:state/districts - Get districts by state
router.get('/states/:state/districts', getDistrictsByState);

// GET /api/colleges/:id - Get a specific college
router.get('/:id', getCollegeById);

module.exports = router;
