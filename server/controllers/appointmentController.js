const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');

// Get all appointments uniquely referencing the calling Patient explicitly polling delayed flags
exports.getPatientAppointments = async (req, res) => {
  try {
    const upcoming = await Appointment.find({ patientId: req.user.id })
                                      .populate('doctorId', 'fullName')
                                      .sort({ date: 1, time: 1 });
    res.status(200).json(upcoming);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Patient polling failed structurally.' });
  }
};

// Return available raw parsed time blocks given a strict configuration
exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query; // date format 'DD-MM-YYYY'
    if (!doctorId || !date) return res.status(400).json({ message: 'DoctorID and Date strictly required.' });

    const config = await Availability.findOne({ doctorId });
    if (!config) return res.status(404).json({ message: 'Doctor has not mapped an availability grid.' });

    // Validate if explicit blackout
    if (config.blackoutDates.includes(date)) return res.status(200).json({ slots: [] });

    // Safely parse robust DD-MM-YYYY into a structural Date block
    const [dS, mS, yS] = date.split('-');
    const dateObj = new Date(`${yS}-${mS}-${dS}`);
    const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const dayOfWeek = dayNames[dateObj.getDay()];

    const shiftData = config.weeklyConfig.find(w => w.day === dayOfWeek);
    if (!shiftData || shiftData.isOff) return res.status(200).json({ slots: [] });

    // Grab all pre-booked appointments evaluating collisions uniquely
    const existingAppts = await Appointment.find({ doctorId, date, status: { $in: ['pending', 'approved'] } });
    const bookedTimes = existingAppts.map(a => a.originalTime || a.time);

    let generatedSlots = [];
    
    // Assess physical localized time safely against shifting bounds
    const now = new Date();
    const localTodayStr = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
    const isToday = (date === localTodayStr);
    
    // Parse the shifts natively mathematically executing structural blocks
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
        
        if (!bookedTimes.includes(timeStr) && !isPast) {
          generatedSlots.push(timeStr);
        }
        currentTotalMins += config.slotDuration;
      }
    });

    res.status(200).json({ slots: generatedSlots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed fetching block structure' });
  }
};

// Book explicitly tracking original times
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, symptoms, status, patientIdOverride } = req.body;
    
    // If a doctor calls this natively (like declaring an emergency), they are the doctor!
    const ultimateDoctorId = (req.user.role === 'doctor') ? req.user.id : doctorId;

    // Database Race-Condition Guardian preventing overlapping locks natively
    const existingSync = await Appointment.findOne({ 
      doctorId: ultimateDoctorId, 
      date, 
      $or: [ { time }, { originalTime: time } ],
      status: { $in: ['pending', 'approved'] } 
    });
    
    if (existingSync) {
       return res.status(400).json({ message: 'This slot was strictly just absorbed dynamically. Please reload slots.' });
    }

    const newAppt = new Appointment({
      patientId: patientIdOverride || req.user.id,
      doctorId: ultimateDoctorId,
      date,
      time,
      originalTime: time,
      symptoms,
      status: status || 'pending'
    });
    await newAppt.save();

    res.status(201).json({ message: 'Slot cleanly locked securely.', appointment: newAppt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Booking binding failed' });
  }
};

// Doctor specific routing mapping requests cleanly tracking emergencies natively
exports.getDoctorAppointmentsDaily = async (req, res) => {
  try {
     const now = new Date();
     const fallbackDate = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
     const date = req.query.date || fallbackDate;
     
     const appointments = await Appointment.find({ doctorId: req.user.id, date })
                                           .populate('patientId', 'fullName age gender phone')
                                           .sort({ time: 1 });
     res.status(200).json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Doctor queue mapping failed' });
  }
};

// Global massive historical fetch natively sorting by newest descending
exports.getDoctorHistory = async (req, res) => {
  try {
     const history = await Appointment.find({ doctorId: req.user.id })
                                      .populate('patientId', 'fullName age gender') // Grab complex meta
                                      .sort({ date: -1, time: -1 }); // Newest absolute dates first
     res.status(200).json(history);
  } catch (error) {
     res.status(500).json({ message: 'Historical absolute binding failed inherently' });
  }
};

// Global status overrides (approve, reject)
exports.updateStatus = async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );

    res.status(200).json(appt);
  } catch (error) {
    res.status(500).json({ message: 'Status failed to map globally' });
  }
};

// The complex Emergency Resolve MongoDB Array Mutation!
exports.resolveEmergencyShift = async (req, res) => {
  try {
    const { elapsedMinutes, date } = req.body; // e.g., 45, '2026-01-28'

    const upcoming = await Appointment.find({ 
      doctorId: req.user.id, 
      date, 
      status: { $in: ['pending', 'approved'] } 
    });

    // Execute heavy mathematics updating MongoDB perfectly capturing structural delays
    const bulkOps = upcoming.map(appt => {
       const [h, m] = appt.time.split(':').map(Number);
       const d = new Date();
       d.setHours(h, m, 0, 0);
       d.setMinutes(d.getMinutes() + Number(elapsedMinutes));
       const shifted = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
       
       return {
         updateOne: {
           filter: { _id: appt._id },
           update: { 
             $set: { time: shifted },
             $inc: { emergencyDelayedMinutes: Number(elapsedMinutes) } // Notifies patient massively!
           }
         }
       };
    });

    if (bulkOps.length > 0) {
      await Appointment.bulkWrite(bulkOps);
    }
    
    // Clear any emergency block natively
    await Appointment.updateMany(
      { doctorId: req.user.id, date, status: 'emergency_active' },
      { $set: { status: 'completed' } }
    );

    res.status(200).json({ message: 'Grid dynamically shifted automatically natively.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Emergency math generation failed natively.' });
  }
};
