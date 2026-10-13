const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireDoctor } = authMiddleware;

// Public Routes
router.get('/public/stats', appointmentController.getPublicStats);

// Patient Routes
router.get('/my', authMiddleware, appointmentController.getPatientAppointments);

router.get('/slots', appointmentController.getAvailableSlots);
router.post('/book', authMiddleware, appointmentController.bookAppointment);

// Doctor Routes
router.get('/doctor', authMiddleware, requireDoctor, appointmentController.getDoctorAppointmentsDaily);
router.get('/doctor/history', authMiddleware, requireDoctor, appointmentController.getDoctorHistory);
router.post('/offline-book', authMiddleware, requireDoctor, appointmentController.offlineBook);
router.put('/:id/status', authMiddleware, requireDoctor, appointmentController.updateStatus);
router.put('/:id/skip', authMiddleware, requireDoctor, appointmentController.skipAppointment);
router.post('/emergency-resolve-and-book', authMiddleware, requireDoctor, appointmentController.resolveAndBookEmergency);
router.post('/emergency-start', authMiddleware, requireDoctor, appointmentController.startEmergency);

router.get('/queue-status', authMiddleware, appointmentController.getQueueStatus);

module.exports = router;
