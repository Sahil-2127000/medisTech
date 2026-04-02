require('dotenv').config();
const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/clinic').then(async () => {
    const appts = await Appointment.find({ doctorId: '69cc9eeb17ad2f76931b8ca8', date: '2026-04-01' });
    console.log("TODAY APPOINTMENTS:", appts.map(a => a.time));
    process.exit(0);
});
