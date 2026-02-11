const cors = require('cors');

// ===========================
// CORS Middleware
// ===========================
const corsMiddleware = cors({
  origin: 'http://localhost:5173', // frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
});

// ===========================
// Logger Middleware
// ===========================
const loggerMiddleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

// ===========================
// Error Handling Middleware
// ===========================
const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = 500;
  let message = 'Internal server error';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((v) => v.message).join(', ');
  }

  // Mongo duplicate key error
  if (err.code && err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue);
    message = `Duplicate value for field: ${field}`;
  }

  // CastError for invalid ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

// ===========================
// Login Validation Middleware
// ===========================
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  const errors = {};

  // Email required and format
  if (!email) {
    errors.email = 'Email is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errors.email = 'Invalid email format';
  }

  // Password required and rules
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  } else if (!/[A-Z]/.test(password)) {
    errors.password = 'Password must contain at least one uppercase letter';
  } else if (!/[a-z]/.test(password)) {
    errors.password = 'Password must contain at least one lowercase letter';
  } else if (!/\d/.test(password)) {
    errors.password = 'Password must contain at least one number';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

module.exports = {
  corsMiddleware,
  loggerMiddleware,
  errorMiddleware,
  validateLogin,
};
