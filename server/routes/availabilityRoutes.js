const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireDoctor } = authMiddleware;

// Secure route uniquely referencing logged-in contextual Doctor identity
router.get('/config', authMiddleware, requireDoctor, availabilityController.getConfig);
router.post('/config', authMiddleware, requireDoctor, availabilityController.upsertConfig);

module.exports = router;
