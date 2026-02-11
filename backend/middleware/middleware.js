const cors = require('cors');

// CORS config
const corsMiddleware = cors({
  origin: 'http://localhost:5173', // your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
});

// Logger middleware
const loggerMiddleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

// Error handling middleware
const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
};

// Validation middleware for login
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  next();
};

module.exports = {
  corsMiddleware,
  loggerMiddleware,
  errorMiddleware,
  validateLogin,
};
