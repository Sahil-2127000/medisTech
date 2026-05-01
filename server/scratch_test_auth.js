require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

async function testQuery() {
  try {
    const mongoUrl = process.env.MONGO_URL;
    console.log("Connecting to:", mongoUrl);
    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected. Querying...");
    
    // The exact lines from authController
    let targetUser = await User.findOne({ email: 'doctor@medistech.com' });
    if (!targetUser) {
        targetUser = await Doctor.findOne({ email: 'doctor@medistech.com' });
    }

    console.log("Query complete:", targetUser);
    process.exit(0);
  } catch (err) {
    console.error("ERROR CAUGHT:");
    console.error(err);
    process.exit(1);
  }
}

testQuery();
