require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    const doctors = await Doctor.find();
    console.log(`Found ${doctors.length} Doctors:`);
    doctors.forEach(d => console.log(`[DOCTOR] ID: ${d._id} | Name: ${d.fullName} | Email: ${d.email} | Phone: ${d.phone} | Spec: ${d.specialization}`));
    
    const users = await User.find();
    console.log(`Found ${users.length} Users:`);
    users.forEach(u => console.log(`[USER] ID: ${u._id} | Name: ${u.fullName} | Email: ${u.email}`));

    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
