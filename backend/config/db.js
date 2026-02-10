const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔧 Attempting MongoDB connection...');
    
    // For mongoose 9+, use this simple connection
    // NO options needed - mongoose handles everything automatically
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`Database: ${mongoose.connection.name}`);
    console.log(`Host: ${mongoose.connection.host}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    // More specific error messages
    if (error.message.includes('bad auth') || error.message.includes('authentication failed')) {
      console.log('\n🔐 AUTHENTICATION ERROR:');
      console.log('Please check:');
      console.log('1. Username/password in .env file');
      console.log('2. User has proper permissions in MongoDB Atlas');
    }
    
    process.exit(1);
  }
};

// Optional: Connection event listeners
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

module.exports = connectDB;