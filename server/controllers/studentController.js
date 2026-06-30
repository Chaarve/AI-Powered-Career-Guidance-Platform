const Student = require('../models/Student');
const Joi = require('joi');

const studentSchema = Joi.object({
  name: Joi.string().required().max(100).trim(),
  marks: Joi.number().required().min(0).max(100),
  declared_interest: Joi.string().required().valid('Science', 'Commerce', 'Arts')
});

const createStudent = async (req, res) => {
  try {
    const { error, value } = studentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    const student = new Student(value);
    await student.save();

    res.status(201).json({
      success: true,
      message: 'Student profile created successfully',
      data: {
        id: student._id,
        name: student.name,
        marks: student.marks,
        declared_interest: student.declared_interest,
        created_at: student.created_at
      }
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create student profile'
    });
  }
};

const getStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student'
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = studentSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    const student = await Student.findByIdAndUpdate(
      id,
      value,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update student'
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete student'
    });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const students = await Student.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ created_at: -1 });

    const total = await Student.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        students,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_students: total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students'
    });
  }
};

module.exports = {
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent,
  getAllStudents
};
