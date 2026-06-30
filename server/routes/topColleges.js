const express = require('express');
const router = express.Router();
const { 
  getTopCollegesByCourse, 
  getTopCollegesByAllCourses, 
  getTopCollegesByStream 
} = require('../controllers/topCollegeController');

// Get top colleges for a specific course
router.get('/by-course', getTopCollegesByCourse);

// Get top colleges for all courses
router.get('/all-courses', getTopCollegesByAllCourses);

// Get top colleges by stream
router.get('/by-stream', getTopCollegesByStream);

module.exports = router;
