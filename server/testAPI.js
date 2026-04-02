const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Appointment = require('./models/Appointment');
const Availability = require('./models/Availability');

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/clinic').then(async () => {
    const doctorId = '69cc9eeb17ad2f76931b8ca8';
    const date = '2026-04-01';

    let avail = await Availability.findOne({ doctorId });
    const defaultShifts = {
      Monday: [{ start: '09:00', end: '13:00' }, { start: '14:00', end: '18:00' }],
      Tuesday: [{ start: '09:00', end: '13:00' }, { start: '14:00', end: '18:00' }],
      Wednesday: [{ start: '09:00', end: '13:00' }, { start: '14:00', end: '18:00' }],
      Thursday: [{ start: '09:00', end: '13:00' }, { start: '14:00', end: '18:00' }],
      Friday: [{ start: '09:00', end: '13:00' }, { start: '14:00', end: '18:00' }],
      Saturday: [{ start: '09:00', end: '13:00' }],
      Sunday: []
    };

    let shiftData = avail ? avail.schedule.get('Wednesday') : { isAvailable: true, slots: defaultShifts['Wednesday'] };
    console.log("SHIFT DATA:", JSON.stringify(shiftData));

    const config = avail ? avail.config : { slotDuration: 30 };
    
    // Simulate query
    const existingAppts = await Appointment.find({ doctorId, date, status: { $in: ['pending', 'approved'] } });
    const bookedTimes = existingAppts.map(a => a.originalTime || a.time);
    console.log("BOOKED:", bookedTimes);

    let generatedSlots = [];
    const now = new Date();
    const localTodayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const isToday = (date === localTodayStr);
    console.log("IS TODAY:", isToday, localTodayStr, "now:", now);

    shiftData.slots.forEach(block => {
      const [startH, startM] = block.start.split(':').map(Number);
      const [endH, endM] = block.end.split(':').map(Number);
      let currentTotalMins = startH * 60 + startM;
      const endTotalMins = endH * 60 + endM;

      while (currentTotalMins + config.slotDuration <= endTotalMins) {
        const h = Math.floor(currentTotalMins / 60).toString().padStart(2, '0');
        const m = (currentTotalMins % 60).toString().padStart(2, '0');
        const timeStr = `${h}:${m}`;
        
        let isPast = false;
        if (isToday) {
           const currentH = now.getHours();
           const currentM = now.getMinutes();
           const currentMinsTotal = currentH * 60 + currentM;
           if (currentTotalMins <= currentMinsTotal) {
              isPast = true;
           }
        }
        
        console.log(`EVALUATING: ${timeStr} | CurrentMins: ${currentTotalMins} <= SystemTotalMins: ${now.getHours()*60+now.getMinutes()} ? ${isPast}`);

        if (!bookedTimes.includes(timeStr) && !isPast) {
          generatedSlots.push(timeStr);
        }
        currentTotalMins += config.slotDuration;
      }
    });

    console.log("FINAL SLOTS:", generatedSlots);
    process.exit(0);
});
