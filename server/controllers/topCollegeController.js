const College = require('../models/College');
const Course = require('../models/Course');

const getTopCollegesByCourse = async (req, res) => {
  try {
    const { courseId, stream, limit = 10 } = req.query;

    let query = { is_active: true };
    let courseFilter = {};

    // If courseId is provided, find colleges offering that course
    if (courseId) {
      courseFilter.courses = courseId;
    } 
    // If stream is provided, find colleges with courses in that stream
    else if (stream) {
      const streamCourses = await Course.find({ stream, is_active: true }).select('_id');
      courseFilter.courses = { $in: streamCourses.map(c => c._id) };
    }

    // Get colleges with the specified courses
    const colleges = await College.find(courseFilter)
      .populate('courses', 'name stream duration_years min_marks')
      .lean();

    // Filter colleges based on the specific course if courseId is provided
    let filteredColleges = colleges;
    if (courseId) {
      filteredColleges = colleges.filter(college => 
        college.courses.some(course => course._id.toString() === courseId)
      );
    }

    // Sort colleges by quality (prioritize government, then by facilities)
    const sortedColleges = filteredColleges.sort((a, b) => {
      // Government colleges first
      if (a.college_type === 'Government' && b.college_type !== 'Government') return -1;
      if (a.college_type !== 'Government' && b.college_type === 'Government') return 1;
      
      // Then by number of facilities
      const aFacilities = Object.values(a.facilities).filter(Boolean).length;
      const bFacilities = Object.values(b.facilities).filter(Boolean).length;
      if (aFacilities !== bFacilities) return bFacilities - aFacilities;
      
      // Then by name alphabetically
      return a.name.localeCompare(b.name);
    });

    // Take top colleges
    const topColleges = sortedColleges.slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        colleges: topColleges,
        total_found: filteredColleges.length,
        top_count: topColleges.length,
        filters: {
          courseId,
          stream,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching top colleges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top colleges'
    });
  }
};

const getTopCollegesByAllCourses = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Get all active courses
    const courses = await Course.find({ is_active: true }).sort({ stream: 1, name: 1 });

    const results = [];

    for (const course of courses) {
      // Find colleges offering this course
      const colleges = await College.find({ 
        is_active: true,
        courses: course._id 
      }).populate('courses', 'name stream duration_years min_marks')
        .lean();

      // Filter to only include this specific course
      const filteredColleges = colleges.filter(college => 
        college.courses.some(c => c._id.toString() === course._id.toString())
      );

      // Sort by quality
      const sortedColleges = filteredColleges.sort((a, b) => {
        if (a.college_type === 'Government' && b.college_type !== 'Government') return -1;
        if (a.college_type !== 'Government' && b.college_type === 'Government') return 1;
        
        const aFacilities = Object.values(a.facilities).filter(Boolean).length;
        const bFacilities = Object.values(b.facilities).filter(Boolean).length;
        if (aFacilities !== bFacilities) return bFacilities - aFacilities;
        
        return a.name.localeCompare(b.name);
      });

      results.push({
        course: {
          id: course._id,
          name: course.name,
          stream: course.stream,
          duration_years: course.duration_years,
          min_marks: course.min_marks,
          description: course.description,
          career_paths: course.career_paths
        },
        top_colleges: sortedColleges.slice(0, parseInt(limit)),
        total_colleges: filteredColleges.length
      });
    }

    res.status(200).json({
      success: true,
      data: {
        courses: results,
        total_courses: results.length,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching top colleges by all courses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top colleges by all courses'
    });
  }
};

const getTopCollegesByStream = async (req, res) => {
  try {
    const { stream, limit = 10 } = req.query;

    if (!stream) {
      return res.status(400).json({
        success: false,
        message: 'Stream is required'
      });
    }

    // Get courses in the specified stream
    const streamCourses = await Course.find({ stream, is_active: true });
    
    if (streamCourses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No courses found for this stream'
      });
    }

    // Get all colleges offering courses in this stream
    const colleges = await College.find({ 
      is_active: true,
      courses: { $in: streamCourses.map(c => c._id) }
    }).populate('courses', 'name stream duration_years min_marks')
      .lean();

    // Filter and sort colleges
    const filteredColleges = colleges.filter(college => 
      college.courses.some(course => course.stream === stream)
    );

    const sortedColleges = filteredColleges.sort((a, b) => {
      if (a.college_type === 'Government' && b.college_type !== 'Government') return -1;
      if (a.college_type !== 'Government' && b.college_type === 'Government') return 1;
      
      const aFacilities = Object.values(a.facilities).filter(Boolean).length;
      const bFacilities = Object.values(b.facilities).filter(Boolean).length;
      if (aFacilities !== bFacilities) return bFacilities - aFacilities;
      
      return a.name.localeCompare(b.name);
    });

    const topColleges = sortedColleges.slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        stream,
        courses: streamCourses,
        colleges: topColleges,
        total_colleges: filteredColleges.length,
        top_count: topColleges.length
      }
    });
  } catch (error) {
    console.error('Error fetching top colleges by stream:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top colleges by stream'
    });
  }
};

module.exports = {
  getTopCollegesByCourse,
  getTopCollegesByAllCourses,
  getTopCollegesByStream
};
