const cors = require('cors');

// ===========================
// CORS Middleware
// ===========================
const corsMiddleware = cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
});

// ===========================
// Logger Middleware
// ===========================
const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  console.log(`[${timestamp}] ${req.method} ${req.url} - ${ip}`);
  next();
};

// ===========================
// Error Handling Middleware
// ===========================
const errorMiddleware = (err, req, res, next) => {
  console.error('\n❌ Error Stack:');
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
    message = `${field} already exists. Please use a different ${field}.`;
  }

  // CastError for invalid ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  });
};

// ===========================
// Login Validation Middleware
// ===========================
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  const errors = {};

  // Email validation
  if (!email) {
    errors.email = 'Email is required';
  } else {
    const trimmedEmail = email.trim();
    if (trimmedEmail.length === 0) {
      errors.email = 'Email cannot be empty';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        errors.email = 'Please enter a valid email address';
      }
    }
  }

  // Password validation
  if (!password) {
    errors.password = 'Password is required';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ 
      success: false, 
      errors,
      message: 'Validation failed'
    });
  }

  req.validatedData = {
    email: email.trim().toLowerCase(),
    password
  };

  next();
};

// ===========================
// Student Validation Middleware
// ===========================
const validateStudent = (req, res, next) => {
  const { name, email, phone, course, status } = req.body;
  const errors = {};

  // Name validation
  if (!name) {
    errors.name = 'Name is required';
  } else {
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      errors.name = 'Name cannot be empty';
    } else if (trimmedName.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (trimmedName.length > 50) {
      errors.name = 'Name must be less than 50 characters';
    }
  }

  // Email validation
  if (!email) {
    errors.email = 'Email is required';
  } else {
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address';
    }
  }

  // Phone validation
  if (!phone) {
    errors.phone = 'Phone number is required';
  } else {
    const trimmedPhone = phone.trim();
    const digitsOnly = trimmedPhone.replace(/\D/g, '');
    
    if (digitsOnly.length === 0) {
      errors.phone = 'Phone number must contain digits';
    } else if (digitsOnly.length < 10) {
      errors.phone = 'Phone number must be at least 10 digits';
    } else if (digitsOnly.length > 15) {
      errors.phone = 'Phone number must be less than 15 digits';
    }
  }

  // Course validation
  const validCourses = [
    "BSc (Hons) in Computer Science",
    "BSc (Hons) in Information Technology",
    "BSc (Hons) in Software Engineering",
    "BSc (Hons) in Data Science"
  ];

  if (!course) {
    errors.course = 'Course is required';
  } else if (!validCourses.includes(course)) {
    errors.course = 'Please select a valid course';
  }

  // Status validation
  const validStatuses = ["Active", "Pending", "Graduated", "Dropped"];

  if (!status) {
    errors.status = 'Status is required';
  } else if (!validStatuses.includes(status)) {
    errors.status = 'Please select a valid status';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ 
      success: false, 
      errors,
      message: 'Validation failed'
    });
  }

  req.validatedStudent = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim().replace(/\D/g, ''),
    course,
    status
  };

  next();
};

// ===========================
// NOT FOUND MIDDLEWARE - REMOVED (now in server.js)
// ===========================

module.exports = {
  corsMiddleware,
  loggerMiddleware,
  errorMiddleware,
  validateLogin,
  validateStudent
};