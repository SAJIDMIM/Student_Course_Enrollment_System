const Student = require('../models/Student');

// @desc    Get all students
// @route   GET /api/students
// @access  Public
const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Public
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Public
const createStudent = async (req, res) => {
  try {
    const { name, email, phone, course, status } = req.body;

    // Check if student with same email already exists
    const studentExists = await Student.findOne({ email });
    if (studentExists) {
      return res.status(400).json({ message: 'Student with this email already exists' });
    }

    const student = await Student.create({
      name,
      email,
      phone,
      course,
      status
    });

    res.status(201).json(student);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Public
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Public
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Student removed successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get students by status
// @route   GET /api/students/status/:status
// @access  Public
const getStudentsByStatus = async (req, res) => {
  try {
    const students = await Student.find({ status: req.params.status });
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students by status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get students by course
// @route   GET /api/students/course/:course
// @access  Public
const getStudentsByCourse = async (req, res) => {
  try {
    const students = await Student.find({ course: req.params.course });
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students by course:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Search students
// @route   GET /api/students/search/:query
// @access  Public
const searchStudents = async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const students = await Student.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { phone: { $regex: searchQuery, $options: 'i' } }
      ]
    });
    res.status(200).json(students);
  } catch (error) {
    console.error('Error searching students:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsByStatus,
  getStudentsByCourse,
  searchStudents
};