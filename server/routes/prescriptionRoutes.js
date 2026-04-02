const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/issue', authMiddleware, prescriptionController.issuePrescription);
router.get('/my', authMiddleware, prescriptionController.getMyPrescriptions);

module.exports = router;
