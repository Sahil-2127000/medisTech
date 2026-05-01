require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

async function testLogin() {
  try {
    const mongoUrl = process.env.MONGO_URL;
    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 5000 });
    
    const email = 'nishugarg737@gmail.com';
    const password = 'somepassword'; // password doesn't matter much if we crash before compare, but let's see where it crashes

    console.log("Looking up user...");
    let targetUser = await User.findOne({ email });
    
    if (!targetUser) {
        console.log("User not found, looking up doctor...");
        targetUser = await Doctor.findOne({ email });
    }

    if (!targetUser) {
      console.log("No user found.");
      process.exit(0);
    }
    
    console.log("Found target user:", targetUser);
    
    console.log("Comparing password...");
    // Cryptographic comparative hash match check
    const isMatch = await bcrypt.compare(password, targetUser.password);
    console.log("Match:", isMatch);
    
    console.log("Signing token...");
    // Sign JWT including role natively (targetUser inherently has .role)
    const token = jwt.sign(
      { id: targetUser._id, email: targetUser.email, role: targetUser.role }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '7d' }
    );
    console.log("Token generated.");
    
    process.exit(0);
  } catch (err) {
    console.error("ERROR CAUGHT:");
    console.error(err);
    process.exit(1);
  }
}

testLogin();
