const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const authMiddleware = require('../middleware/authMiddleware');

// Secure route uniquely referencing logged-in contextual Doctor identity
router.get('/config', authMiddleware, availabilityController.getConfig);
router.post('/config', authMiddleware, availabilityController.upsertConfig);

module.exports = router;
