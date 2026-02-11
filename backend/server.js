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
// SIMPLE AUTH ENDPOINT
// ===========================
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return res.status(500).json({
      success: false,
      message: "Server configuration error"
    });
  }

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.status(200).json({
      success: true,
      email: ADMIN_EMAIL,
      role: "admin",
      token: "demo-token-" + Date.now(),
      message: "Login successful"
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid email or password"
  });
});

// ===========================
// Student Routes
// ===========================
app.use('/api/students', studentRoutes);

// ===========================
// Health Check Route
// ===========================
app.get('/', (req, res) => {
  res.json({
    message: 'Student Enrollment API is running 🚀',
    database: 'Connected to MongoDB',
    authentication: 'POST /api/auth/login'
  });
});

// ===========================
// 404 Handler
// ===========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
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
  console.log(`\n✅ Server running on port ${PORT} 🚀`);
  console.log(`📍 API: http://localhost:${PORT}`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/login\n`);
});

module.exports = app;