const express = require('express');
const router = express.Router();
const vitalController = require('../controllers/vitalController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.get('/my', authMiddleware, vitalController.getMyVitals);
router.post('/add', authMiddleware, vitalController.addVital);
router.get('/trend/:type', authMiddleware, vitalController.getVitalTrend);

module.exports = router;
