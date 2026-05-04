const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

// Patient Routes
router.get('/my', authMiddleware, appointmentController.getPatientAppointments);
router.get('/slots', appointmentController.getAvailableSlots);
router.post('/book', authMiddleware, appointmentController.bookAppointment);

// Doctor Routes
router.get('/doctor', authMiddleware, appointmentController.getDoctorAppointmentsDaily);
router.get('/doctor/history', authMiddleware, appointmentController.getDoctorHistory);
router.post('/offline-book', authMiddleware, appointmentController.offlineBook);
router.put('/:id/status', authMiddleware, appointmentController.updateStatus);
router.put('/:id/skip', authMiddleware, appointmentController.skipAppointment);
router.post('/emergency-resolve-and-book', authMiddleware, appointmentController.resolveAndBookEmergency);
router.post('/emergency-start', authMiddleware, appointmentController.startEmergency);

router.get('/queue-status', authMiddleware, appointmentController.getQueueStatus);

module.exports = router;
