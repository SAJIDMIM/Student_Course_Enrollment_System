require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const { corsMiddleware, loggerMiddleware, errorMiddleware } = require('./middleware/middleware');

const app = express();

// ===========================
// Middleware
// ===========================
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// ===========================
// Database connection
// ===========================
if (process.env.MONGO_URI) {
  console.log('Connecting to MongoDB...');
  connectDB();
} else {
  console.error('MONGO_URI is not defined in .env file');
  process.exit(1);
}

// ===========================
// Routes
// ===========================
app.use('/api/students', studentRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Student Enrollment API is running 🚀',
    database: 'Connected to MongoDB',
    endpoints: {
      students: 'GET /api/students',
      createStudent: 'POST /api/students',
      getStudent: 'GET /api/students/:id',
      updateStudent: 'PUT /api/students/:id',
      deleteStudent: 'DELETE /api/students/:id',
      getByStatus: 'GET /api/students/status/:status',
      getByCourse: 'GET /api/students/course/:course',
      search: 'GET /api/students/search/:query'
    }
  });
});

// ===========================
// Error handling middleware
// ===========================
app.use(errorMiddleware);

// ===========================
// Start server
// ===========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
  console.log(`API available at http://localhost:${PORT}/api/students`);
});