const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
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

// Helper to compute all potential time slots for a doctor on a specific date strictly mapping grid configuration
const getSlotsList = async (doctorId, date) => {
  const config = await Availability.findOne({ doctorId });
  if (!config) return { error: 'Doctor has not mapped an availability grid.' };

  if (config.blackoutDates.includes(date)) return { slots: [], isOff: true };

  const [dS, mS, yS] = date.split('-').map(Number);
  const dateObj = new Date(yS, mS - 1, dS);
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const dayOfWeek = dayNames[dateObj.getDay()];

  const shiftData = config.weeklyConfig.find(w => w.day === dayOfWeek);
  if (!shiftData || shiftData.isOff) return { slots: [], isOff: true };

  let allSlots = [];
  shiftData.slots.forEach(block => {
    const [startH, startM] = block.start.split(':').map(Number);
    const [endH, endM] = block.end.split(':').map(Number);
    let currentTotalMins = startH * 60 + startM;
    const endTotalMins = endH * 60 + endM;

    while (currentTotalMins + Number(config.slotDuration) <= endTotalMins) {
      const h = Math.floor(currentTotalMins / 60).toString().padStart(2, '0');
      const m = (currentTotalMins % 60).toString().padStart(2, '0');
      allSlots.push(`${h}:${m}`);
      currentTotalMins += Number(config.slotDuration);
    }
  });

  return { slots: allSlots, config };
};

// Return available raw parsed time blocks given a strict configuration
exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query; // date format 'DD-MM-YYYY'
    if (!doctorId || !date) return res.status(400).json({ message: 'DoctorID and Date strictly required.' });

    const result = await getSlotsList(doctorId, date);
    if (result.error) return res.status(404).json({ message: result.error });
    if (result.isOff) return res.status(200).json({ isOff: true, slots: [] });

    // Grab all pre-booked appointments evaluating collisions uniquely
    const existingAppts = await Appointment.find({ doctorId, date, status: { $in: ['pending', 'approved'] } });
    const bookedTimes = existingAppts.map(a => a.originalTime || a.time);

    const now = new Date();
    const localTodayStr = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
    const isToday = (date === localTodayStr);

    const generatedSlots = result.slots.map(timeStr => {
      let isPast = false;
      if (isToday) {
        const [h, m] = timeStr.split(':').map(Number);
        const currentMinsTotal = now.getHours() * 60 + now.getMinutes();
        if ((h * 60 + m) <= currentMinsTotal) isPast = true;
      }
      return { 
        time: timeStr, 
        isAvailable: !bookedTimes.includes(timeStr) && !isPast
      };
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
    const { doctorId, date, time, patientName, symptoms, status, patientIdOverride } = req.body;
    
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

    // Calculate token number mapped to the physical slot index (1-indexed)
    const slotResult = await getSlotsList(ultimateDoctorId, date);
    let tokenNumber = 0;
    if (slotResult.slots) {
       const index = slotResult.slots.indexOf(time);
       tokenNumber = index !== -1 ? index + 1 : 0;
    }

    const newAppt = new Appointment({
      patientId: patientIdOverride || req.user.id,
      patientName: patientName || (req.user.role === 'patient' ? req.user.fullName : undefined),
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
       
       const subject = "Appointment Request Received - MedisTech";
       const targetName = populatedAppt.patientName || pName;
       
       const html = `<h2>Hello ${pName},</h2>
                    <p>Your appointment request for <strong>${targetName}</strong> with <strong>Dr. ${dName}</strong> has been received.</p>
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
     // Search logic for both account holder name and explicit patient name
     if (search) {
       const users = await require('../models/User').find({ 
         $or: [
           { fullName: { $regex: search, $options: 'i' } },
           { patientUid: { $regex: search, $options: 'i' } }
         ],
         role: 'patient'
       }).select('_id');
       patientIds = users.map(u => u._id);
       
       query.$or = [
         { patientId: { $in: patientIds } },
         { patientName: { $regex: search, $options: 'i' } }
       ];
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
       const targetName = appt.patientName || pName;
       
       let subject = "";
       let html = "";
       
       if (status === 'approved') {
          subject = "Appointment Accepted - MedisTech";
          html = `<h2>Hello ${pName},</h2>
                  <p>The appointment for <strong>${targetName}</strong> with <strong>Dr. ${dName}</strong> on <strong>${appt.date}</strong> at <strong>${appt.time}</strong> has been <strong>Accepted</strong>.</p>
                  <p>We look forward to seeing you!</p>`;
       } else if (status === 'rejected') {
          subject = "Appointment Update - MedisTech";
          html = `<h2>Hello ${pName},</h2>
                  <p>We regret to inform you that the appointment for <strong>${targetName}</strong> with <strong>Dr. ${dName}</strong> on <strong>${appt.date}</strong> at <strong>${appt.time}</strong> has been <strong>Cancelled/Rejected</strong>.</p>
                  <p>Please log in to the dashboard to schedule a different time.</p>`;
       } else if (status === 'completed') {
          subject = "Consultation Completed - MedisTech";
          html = `<h2>Hello ${pName},</h2>
                  <p>The consultation for <strong>${targetName}</strong> with <strong>Dr. ${dName}</strong> has been marked as <strong>Completed</strong>.</p>
                  <p>You can view the medical records in the patient dashboard.</p>
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
exports.resolveAndBookEmergency = async (req, res) => {
  try {
    const { elapsedMinutes, date, fullName, email, age, gender, phone, symptoms } = req.body;
    const doctorId = req.user.id;

    // 1. Find or create the patient
    let patient = await User.findOne({ email });
    if (!patient && phone) {
      patient = await User.findOne({ phone });
    }

    let isNewPatient = false;
    let generatedPassword = null;

    if (!patient) {
      isNewPatient = true;
      generatedPassword = crypto.randomBytes(4).toString('hex'); // 8 characters
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(generatedPassword, salt);

      let patientUid;
      let isUnique = false;
      while (!isUnique) {
        const digits = Math.floor(100000 + Math.random() * 900000);
        patientUid = `P${digits}`;
        const existingUid = await User.findOne({ patientUid });
        if (!existingUid) isUnique = true;
      }

      patient = new User({ 
        fullName, 
        email, 
        password: hashedPassword, 
        role: 'patient', 
        age, 
        gender, 
        phone, 
        patientUid 
      });
      await patient.save();
    }

    // 2. Create the completed Emergency Appointment natively
    const now = new Date();
    const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // We get the next token number
    const activeApptsCount = await Appointment.countDocuments({ doctorId, date });
    const tokenNumber = activeApptsCount + 1;

    const newAppointment = new Appointment({
      patientId: patient._id,
      doctorId,
      date,
      time: currentTimeStr,
      originalTime: currentTimeStr,
      symptoms: `[TRIAGE] ${symptoms}`,
      status: 'completed',
      tokenNumber,
      estimatedWaitTime: 0
    });
    await newAppointment.save();

    // 3. Shift upcoming appointments
    const upcoming = await Appointment.find({ 
      doctorId, 
      date, 
      status: { $in: ['pending', 'approved'] } 
    });

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
             $inc: { emergencyDelayedMinutes: Number(elapsedMinutes) }
           }
         }
       };
    });

    if (bulkOps.length > 0) {
      await Appointment.bulkWrite(bulkOps);
    }

    // Reset Doctor emergency status
    await Doctor.findByIdAndUpdate(doctorId, { isEmergencyActive: false });

    // 4. Send Email to Patient
    if (patient.email && patient.emailNotifications !== false) {
      const pName = capitalizeNames(patient.fullName);
      let html = `<h2>Hello ${pName},</h2>
                  <p>Your emergency consultation has been logged successfully.</p>`;

      if (isNewPatient) {
        html += `<div style="margin-top: 20px; padding: 15px; border-radius: 8px; background-color: #f8fafc; border: 1px solid #e2e8f0;">
                    <h3 style="color: #3b82f6; margin-top: 0;">Your New Patient Account</h3>
                    <p>We've created a dashboard for you to track your history and prescriptions.</p>
                    <p><strong>Email:</strong> ${patient.email}<br>
                    <strong>Password:</strong> <span style="font-family: monospace; font-weight: bold; font-size: 16px; background: #e2e8f0; padding: 4px 8px; border-radius: 4px;">${generatedPassword}</span></p>
                 </div>`;
      }
      sendEmail(patient.email, "Emergency Consultation - Clinic@Flow", html).catch(e => console.error("Email fail:", e));
    }

    // Trigger Socket.io to refresh the patient dashboard banners and timings
    const io = req.app.get('socketio');
    if (io) {
      io.emit('queueUpdated', { doctorId });
    }

    const savedAppointment = await Appointment.findById(newAppointment._id).populate('patientId');

    res.status(200).json({ message: 'Emergency recorded and queue dynamically shifted natively.', appointment: savedAppointment });
  } catch (error) {
    console.error('Emergency Math Error:', error);
    res.status(500).json({ message: 'Emergency generation failed natively.' });
  }
};

// Start Emergency protocol natively updating DB status
exports.startEmergency = async (req, res) => {
  try {
    const doctorId = req.user.id;
    await Doctor.findByIdAndUpdate(doctorId, { isEmergencyActive: true });
    
    // Broadcast via Socket.io
    const io = req.app.get('socketio');
    if (io) io.emit('queueUpdated', { doctorId });

    res.status(200).json({ message: 'Emergency protocol started.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to start emergency protocol.' });
  }
};

// Live Queue Tracking Logic
exports.getQueueStatus = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) return res.status(400).json({ message: 'Params required.' });

    // Check if Doctor has an active emergency
    const doc = await Doctor.findById(doctorId).select('isEmergencyActive');
    const isEmergencyActive = doc ? doc.isEmergencyActive : false;

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
      activeAppointmentId: active ? active._id : null,
      isEmergencyActive
    });
  } catch (error) {
    res.status(500).json({ message: 'Queue data failed' });
  }
};

// Smart Skip: Reschedule patient to the latest available slot of the day
exports.skipAppointment = async (req, res) => {
  try {
    console.log(`[DEBUG] skipAppointment triggered for ID: ${req.params.id}`);
    const appt = await Appointment.findById(req.params.id)
                                  .populate('patientId', 'fullName email emailNotifications')
                                  .populate('doctorId', 'fullName');

    if (!appt) {
      console.log(`[DEBUG] Appointment ${req.params.id} not found.`);
      return res.status(404).json({ message: 'Appointment not found natively' });
    }

    const { doctorId, date } = appt;
    // Extract ID even if populated to be safe for DB queries and socket emits
    const targetDoctorId = doctorId._id ? doctorId._id : doctorId;
    
    console.log(`[DEBUG] Rescheduling for Doctor: ${targetDoctorId}, Date: ${date}`);
    const result = await getSlotsList(targetDoctorId, date);
    
    if (result.error || result.isOff) {
      console.log(`[DEBUG] getSlotsList failed: ${result.error || 'isOff'}`);
      return res.status(400).json({ message: 'Cannot reschedule: Clinic is off or configuration missing.' });
    }

    // Find already occupied slots for the day (excluding this specific appointment)
    const busyAppts = await Appointment.find({ 
      doctorId: targetDoctorId, 
      date, 
      _id: { $ne: appt._id }, 
      status: { $in: ['pending', 'approved', 'in_progress'] } 
    });
    const busyTimes = busyAppts.map(a => a.time);
    console.log(`[DEBUG] Booked times:`, busyTimes);

    // Filter available slots and find the latest one
    const availableSlots = result.slots.filter(s => !busyTimes.includes(s));
    console.log(`[DEBUG] Available slots: ${availableSlots.length}`);
    
    if (availableSlots.length === 0) {
      return res.status(400).json({ message: 'No available slots left today to reschedule this patient.' });
    }

    const latestSlot = availableSlots[availableSlots.length - 1]; // Last slot of the day
    const newTokenNumber = result.slots.indexOf(latestSlot) + 1;

    const oldTime = appt.time;
    appt.time = latestSlot;
    appt.tokenNumber = newTokenNumber;
    await appt.save();
    console.log(`[DEBUG] Appt successfully moved from ${oldTime} to ${latestSlot} (Token ${newTokenNumber})`);

    // Notify Patient via Email
    if (appt.patientId && appt.patientId.email && appt.patientId.emailNotifications !== false) {
      const pName = capitalizeNames(appt.patientId.fullName);
      const dName = capitalizeNames(appt.doctorId.fullName);
      
      const subject = "Appointment Update - Clinic@Flow";
      const html = `<h2>Hello ${pName},</h2>
                    <p>Your appointment with <strong>Dr. ${dName}</strong> has been <strong>Rescheduled</strong> to the end of the day's queue.</p>
                    <p><strong>New Time:</strong> ${appt.time}<br>
                    <strong>New Token:</strong> ${appt.tokenNumber}</p>
                    <p>Previous Time: ${oldTime}</p>
                    <p>Please log in to your dashboard for live queue updates.</p>`;
      sendEmail(appt.patientId.email, subject, html).catch(e => console.error("Email fail:", e));
    }

    // Trigger Socket.io update natively
    const io = req.app.get('socketio');
    if (io) {
      const emitId = targetDoctorId.toString();
      console.log(`[DEBUG] Emitting queueUpdated for Doctor: ${emitId}`);
      io.emit('queueUpdated', { doctorId: emitId });
    }

    res.status(200).json({ message: 'Patient rescheduled to the latest slot.', appointment: appt });
  } catch (error) {
    console.error('Skip Error:', error);
    res.status(500).json({ message: 'Failed to reschedule patient.' });
  }
};

// Offline Booking explicitly for doctors to register walk-ins natively
exports.offlineBook = async (req, res) => {
  try {
    const { fullName, email, age, gender, phone, date, time, symptoms } = req.body;
    const doctorId = req.user.id;

    if (!fullName || !email || !date || !time) {
      return res.status(400).json({ message: 'Missing critical patient or schedule data.' });
    }

    // Attempt to locate existing patient by email or phone
    let patient = await User.findOne({ email });
    if (!patient && phone) {
      patient = await User.findOne({ phone });
    }

    let isNewPatient = false;
    let generatedPassword = null;

    if (!patient) {
      // Create new patient
      isNewPatient = true;
      generatedPassword = crypto.randomBytes(4).toString('hex'); // 8 characters
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(generatedPassword, salt);

      // Generate Unique Patient UID strictly natively
      let patientUid;
      let isUnique = false;
      while (!isUnique) {
        const digits = Math.floor(100000 + Math.random() * 900000);
        patientUid = `P${digits}`;
        const existingUid = await User.findOne({ patientUid });
        if (!existingUid) isUnique = true;
      }

      patient = new User({ 
        fullName, 
        email, 
        password: hashedPassword, 
        role: 'patient', 
        age, 
        gender, 
        phone, 
        patientUid 
      });
      await patient.save();
    }

    // Validate if slot is already booked (double check)
    const existingAppt = await Appointment.findOne({ doctorId, date, time, status: { $in: ['pending', 'approved', 'in_progress'] } });
    if (existingAppt) {
      return res.status(400).json({ message: 'Slot already booked. Please refresh and select another.' });
    }

    // Calculate Token Number
    const result = await getSlotsList(doctorId, date);
    if (result.error) return res.status(400).json({ message: result.error });
    let tokenNumber = result.slots.indexOf(time) + 1;
    if (tokenNumber === 0) {
      const activeApptsCount = await Appointment.countDocuments({ doctorId, date, status: { $in: ['pending', 'approved', 'in_progress'] } });
      tokenNumber = activeApptsCount + 1;
    }

    // Create the Appointment explicitly bypassing 'pending' state since the doctor directly books it
    const newAppointment = new Appointment({
      patientId: patient._id,
      doctorId,
      date,
      time,
      originalTime: time,
      symptoms,
      status: 'approved',
      tokenNumber,
      estimatedWaitTime: 15
    });

    await newAppointment.save();

    // Trigger Socket.io update natively
    const io = req.app.get('socketio');
    if (io) {
      io.emit('queueUpdated', { doctorId });
    }

    // Send Email to Patient
    if (patient.email && patient.emailNotifications !== false) {
      const pName = capitalizeNames(patient.fullName);
      let html = `<h2>Hello ${pName},</h2>
                  <p>Your offline appointment has been successfully scheduled!</p>
                  <p><strong>Date:</strong> ${date}<br>
                  <strong>Time:</strong> ${time}<br>
                  <strong>Token Number:</strong> ${tokenNumber}</p>`;

      if (isNewPatient) {
        html += `<div style="margin-top: 20px; padding: 15px; border-radius: 8px; background-color: #f8fafc; border: 1px solid #e2e8f0;">
                    <h3 style="color: #3b82f6; margin-top: 0;">Your Account Details</h3>
                    <p>We have created an account for you so you can track your queue live!</p>
                    <p><strong>Email:</strong> ${patient.email}<br>
                    <strong>Password:</strong> <span style="font-family: monospace; font-weight: bold; font-size: 16px; background: #e2e8f0; padding: 4px 8px; border-radius: 4px;">${generatedPassword}</span></p>
                    <p><em>Please login and change your password as soon as possible.</em></p>
                 </div>`;
      }
      
      html += `<p>Thank you for choosing our clinic.</p>`;
      
      sendEmail(patient.email, "Appointment Scheduled - Clinic@Flow", html).catch(e => console.error("Email fail:", e));
    }

    res.status(201).json({ 
      message: isNewPatient ? 'Patient registered and appointment booked!' : 'Appointment booked for existing patient.', 
      appointment: newAppointment 
    });

  } catch (error) {
    console.error('Offline Booking Error:', error);
    res.status(500).json({ message: 'Server error processing offline booking.' });
  }
};

