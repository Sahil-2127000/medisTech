require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("Connected to MongoDB.");
    await User.updateMany({}, { role: 'doctor' });
    console.log("Forced all active accounts mapping to Doctor role for testing!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
