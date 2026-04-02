const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/send-otp', authController.sendOtp);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/doctors', authController.getDoctors);

router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);

module.exports = router;
