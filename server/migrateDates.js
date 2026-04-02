require('dotenv').config();
const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
const Availability = require('./models/Availability');

// Regex matches exact strict YYYY-MM-DD
const oldDateRegex = /^\d{4}-\d{2}-\d{2}$/;

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/clinicflow');
        console.log("Connected to MongoDB for Date Migration...");
        
        // 1. Migrate Appointments
        const appointments = await Appointment.find({});
        let alteredAppointments = 0;
        for (let app of appointments) {
            if (oldDateRegex.test(app.date)) {
                const [y, m, d] = app.date.split('-');
                app.date = `${d}-${m}-${y}`;
                await app.save();
                alteredAppointments++;
            }
        }
        console.log(`Successfully migrated ${alteredAppointments} Appointments to DD-MM-YYYY format.`);
        
        // 2. Migrate Availabilities Blackout Dates
        const availabilities = await Availability.find({});
        let alteredConfigs = 0;
        for (let av of availabilities) {
            let changed = false;
            if (av.blackoutDates && av.blackoutDates.length > 0) {
               const newBlackouts = av.blackoutDates.map(dateStr => {
                   if (oldDateRegex.test(dateStr)) {
                       changed = true;
                       const [y, m, d] = dateStr.split('-');
                       return `${d}-${m}-${y}`;
                   }
                   return dateStr;
               });
               
               if (changed) {
                   av.blackoutDates = newBlackouts;
                   await av.save();
                   alteredConfigs++;
               }
            }
        }
        console.log(`Successfully migrated ${alteredConfigs} Availability Profiles to DD-MM-YYYY format.`);
        
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();
