const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/clinicflow';
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB successfully (MVC Struct)');
  } catch (error) {
    console.error(' MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
