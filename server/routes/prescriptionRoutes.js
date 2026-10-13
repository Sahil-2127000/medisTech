const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireDoctor } = authMiddleware;

router.post('/issue', authMiddleware, requireDoctor, prescriptionController.issuePrescription);
router.get('/my', authMiddleware, prescriptionController.getMyPrescriptions);
router.get('/patient/:patientId', authMiddleware, requireDoctor, prescriptionController.getPatientHistory);

module.exports = router;
