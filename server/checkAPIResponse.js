require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    const doc = await Doctor.findOne();
    if (doc) {
      console.log('--- DOCTOR DOC ---');
      console.log(JSON.stringify(doc.toObject(), null, 2));
    }
    const usr = await User.findOne();
    if (usr) {
      console.log('--- USER DOC ---');
      console.log(JSON.stringify(usr.toObject(), null, 2));
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
