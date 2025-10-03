/**
 * Database Configuration
 * MongoDB connection setup with Mongoose
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use environment variable or default to in-memory for testing
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yelllow-cross';
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    
    await mongoose.connect(mongoURI, options);
    
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    // Allow app to continue without DB - warning only
    console.log('Continuing without database connection...');
  }
};

// Function to check if database is connected
const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = { connectDB, isConnected };
