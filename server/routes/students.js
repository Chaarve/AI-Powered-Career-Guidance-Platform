const express = require('express');
const router = express.Router();
const {
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent,
  getAllStudents
} = require('../controllers/studentController');

// POST /api/students - Create a new student
router.post('/', createStudent);

// GET /api/students - Get all students with pagination
router.get('/', getAllStudents);

// GET /api/students/:id - Get a specific student
router.get('/:id', getStudent);

// PUT /api/students/:id - Update a student
router.put('/:id', updateStudent);

// DELETE /api/students/:id - Delete a student
router.delete('/:id', deleteStudent);

module.exports = router;
