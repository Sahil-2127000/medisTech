const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');
const { sendEmail } = require('../utils/emailService');

const capitalizeNames = (name) => {
  if (!name) return name;
  return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

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
    if (config.blackoutDates.includes(date)) return res.status(200).json({ isOff: true, slots: [] });

    // Safely parse robust DD-MM-YYYY into a structural Date block natively
    const [dS, mS, yS] = date.split('-').map(Number);
    const dateObj = new Date(yS, mS - 1, dS);
    const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const dayOfWeek = dayNames[dateObj.getDay()];

    console.log(`[DEBUG] getAvailableSlots: DoctorId=${doctorId}, Date=${date}, DayOfWeek=${dayOfWeek}`);
    
    const shiftData = config.weeklyConfig.find(w => w.day === dayOfWeek);
    console.log(`[DEBUG] ShiftData found:`, !!shiftData);
    
    if (!shiftData || shiftData.isOff) {
      console.log(`[DEBUG] Clinic is OFF on ${dayOfWeek}`);
      return res.status(200).json({ isOff: true, slots: [] });
    }

    const [startH, startM] = shiftData.slots[0].start.split(':').map(Number);
    console.log(`[DEBUG] Parsing block: Start=${shiftData.slots[0].start}, StartMins=${startH * 60 + startM}`);


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
        
        generatedSlots.push({ 
          time: timeStr, 
          isAvailable: !bookedTimes.includes(timeStr) && !isPast
        });
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

    // Calculate the next token number for this doctor on this day
    const count = await Appointment.countDocuments({ doctorId: ultimateDoctorId, date });
    const tokenNumber = count + 1;

    const newAppt = new Appointment({
      patientId: patientIdOverride || req.user.id,
      doctorId: ultimateDoctorId,
      date,
      time,
      originalTime: time,
      symptoms,
      status: status || 'pending',
      tokenNumber
    });
    await newAppt.save();

    // Populate for email notification
    const populatedAppt = await Appointment.findById(newAppt._id)
                                           .populate('patientId', 'fullName email emailNotifications')
                                           .populate('doctorId', 'fullName email');

    if (populatedAppt && populatedAppt.patientId && populatedAppt.patientId.email && populatedAppt.patientId.emailNotifications !== false) {
       const pName = capitalizeNames(populatedAppt.patientId.fullName);
       const dName = capitalizeNames(populatedAppt.doctorId.fullName);
       
       const subject = "Appointment Request Received - Clinic@Flow";
       const html = `<h2>Hello ${pName},</h2>
                    <p>Your appointment request with <strong>Dr. ${dName}</strong> has been received.</p>
                    <p><strong>Date:</strong> ${populatedAppt.date}<br>
                    <strong>Time:</strong> ${populatedAppt.time}</p>
                    <p>Status: <strong>Pending Approval</strong></p>
                    <p>You will receive another email once the doctor accepts your request.</p>`;
       await sendEmail(populatedAppt.patientId.email, subject, html);
    }

    // Notify everyone via Socket.io inherently
    const io = req.app.get('socketio');
    if (io) {
      io.emit('queueUpdated', { doctorId: ultimateDoctorId.toString() });
    }

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
                                           .populate('patientId', 'fullName age gender phone patientUid')
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
     const page = parseInt(req.query.page) || 1;
     const limit = parseInt(req.query.limit) || 10;
     const skip = (page - 1) * limit;
     const search = req.query.search || '';
     const statusFilter = req.query.status || '';

     let query = { doctorId: req.user.id };
     
     // Only include non-pending in history if asked (or just return all requested)
     // Actually, let's just make it a general query for the doctor
     if (statusFilter) {
       query.status = statusFilter;
     }

     // Search logic for populated fields in Mongoose is best done via aggregation or dual-query
     let patientIds = [];
     if (search) {
       const users = await require('../models/User').find({ 
         fullName: { $regex: search, $options: 'i' },
         role: 'patient'
       }).select('_id');
       patientIds = users.map(u => u._id);
       query.patientId = { $in: patientIds };
     }

     const totalCount = await Appointment.countDocuments(query);
     const totalPages = Math.ceil(totalCount / limit);

     const history = await Appointment.find(query)
                                      .populate('patientId', 'fullName age gender patientUid')
                                      .sort({ date: -1, time: -1 })
                                      .skip(skip)
                                      .limit(limit);

     res.status(200).json({
       data: history,
       totalCount,
       totalPages,
       currentPage: page
     });
  } catch (error) {
     console.error(error);
     res.status(500).json({ message: 'Historical absolute binding failed inherently' });
  }
};

// Global status overrides (approve, reject)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appt = await Appointment.findById(req.params.id)
                                  .populate('patientId', 'fullName email emailNotifications')
                                  .populate('doctorId', 'fullName');

    if (!appt) return res.status(404).json({ message: 'Appointment not found natively' });

    appt.status = status;
    await appt.save();

    // Send Status Update Email natively
    if (appt.patientId && appt.patientId.email && appt.patientId.emailNotifications !== false) {
       const pName = capitalizeNames(appt.patientId.fullName);
       const dName = capitalizeNames(appt.doctorId.fullName);
       
       let subject = "";
       let html = "";
       
       if (status === 'approved') {
          subject = "Appointment Accepted - Clinic@Flow";
          html = `<h2>Hello ${pName},</h2>
                  <p>Your appointment with <strong>Dr. ${dName}</strong> on <strong>${appt.date}</strong> at <strong>${appt.time}</strong> has been <strong>Accepted</strong>.</p>
                  <p>We look forward to seeing you!</p>`;
       } else if (status === 'rejected') {
          subject = "Appointment Update - Clinic@Flow";
          html = `<h2>Hello ${pName},</h2>
                  <p>We regret to inform you that your appointment with <strong>Dr. ${dName}</strong> on <strong>${appt.date}</strong> at <strong>${appt.time}</strong> has been <strong>Cancelled/Rejected</strong>.</p>
                  <p>Please log in to the dashboard to schedule a different time.</p>`;
       } else if (status === 'completed') {
          subject = "Consultation Completed - Clinic@Flow";
          html = `<h2>Hello ${pName},</h2>
                  <p>Your consultation with <strong>Dr. ${dName}</strong> has been marked as <strong>Completed</strong>.</p>
                  <p>You can view your medical records in the patient dashboard.</p>
                  <p>Stay healthy!</p>`;
       }

       if (subject && html) {
          await sendEmail(appt.patientId.email, subject, html);
       }
    }

    // Trigger Socket.io natively
    const io = req.app.get('socketio');
    if (io) {
      io.emit('queueUpdated', { doctorId: appt.doctorId._id ? appt.doctorId._id.toString() : appt.doctorId.toString() });
    }

    res.status(200).json(appt);
  } catch (error) {
    console.error('Status Update Error:', error);
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

// Live Queue Tracking Logic
exports.getQueueStatus = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) return res.status(400).json({ message: 'Params required.' });

    // Find the token currently 'in_progress'
    const active = await Appointment.findOne({ doctorId, date, status: 'in_progress' }).sort({ tokenNumber: 1 });
    
    // Find the last completed token to estimate if no one is in_progress
    const lastCompleted = await Appointment.findOne({ doctorId, date, status: 'completed' }).sort({ tokenNumber: -1 });

    const currentlyServing = active ? active.tokenNumber : (lastCompleted ? lastCompleted.tokenNumber : 0);

    // If the caller is a patient, find their token and calculate wait
    let patientToken = null;
    let waitTime = 0;
    let estimatedTimeFormatted = null;

    if (req.user && req.user.role === 'patient') {
      const myAppt = await Appointment.findOne({ doctorId, date, patientId: req.user.id, status: { $in: ['pending', 'approved'] } });
      if (myAppt) {
        patientToken = myAppt.tokenNumber;
        // Calculation: (MyToken - CurrentlyServing) * dynamic basis
        const gap = patientToken - currentlyServing;
        waitTime = gap > 0 ? gap * 15 : 0; // Baseline 15 mins

        // Dynamically shift physical clock forward
        if (gap > 0 && currentlyServing > 0) {
            const eta = new Date();
            eta.setMinutes(eta.getMinutes() + waitTime);
            
            let hours = eta.getHours();
            const minutes = eta.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; 
            const minStr = minutes < 10 ? '0' + minutes : minutes;
            estimatedTimeFormatted = `${hours}:${minStr} ${ampm}`;
        } else if (gap > 0 && currentlyServing === 0) {
            // Queue hasn't started natively, fallback to original physical slot mapping
            estimatedTimeFormatted = myAppt.originalTime || myAppt.time;
        } else {
            // Already time
            estimatedTimeFormatted = "Now";
        }
      }
    }

    res.status(200).json({
      currentlyServing,
      patientToken,
      estimatedWaitMinutes: waitTime,
      estimatedTimeFormatted,
      activeAppointmentId: active ? active._id : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Queue data failed' });
  }
};
