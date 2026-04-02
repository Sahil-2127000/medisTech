const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Appointment = require('./models/Appointment');
const Availability = require('./models/Availability');

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/clinic').then(async () => {
    const doctorId = '69cc9eeb17ad2f76931b8ca8'; // MV Sharma
    const date = '2026-04-01';

    const avail = await Availability.findOne({ doctorId });
    console.log("Availability Document:", avail);

    const now = new Date();
    console.log("Server Now:", now, " | Local Time:", now.toString(), " | Hours:", now.getHours(), " | Mins:", now.getMinutes());

    process.exit(0);
});
