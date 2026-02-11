const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsByStatus,
  getStudentsByCourse,
  searchStudents
} = require('../controllers/studentController');

// Student routes
router.route('/')
  .get(getStudents)
  .post(createStudent);

router.route('/:id')
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

// Additional routes
router.get('/status/:status', getStudentsByStatus);
router.get('/course/:course', getStudentsByCourse);
router.get('/search/:query', searchStudents);

module.exports = router;