require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db'); // optional
const loginRoutes = require('./routes/loginRoutes');
const { corsMiddleware, loggerMiddleware, errorMiddleware } = require('./middleware/middleware');

const app = express();

// ===========================
// Middleware
// ===========================
app.use(corsMiddleware);
app.use(express.json());
app.use(loggerMiddleware);

// ===========================
// Database connection (optional)
// ===========================
console.log('Connecting to MongoDB...');
connectDB(); // optional, needed only if using student DB

// ===========================
// Routes
// ===========================
app.use('/api', loginRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Server is running 🚀',
    database: 'Connected to MongoDB (if running)'
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
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
