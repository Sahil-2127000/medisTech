const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/upload', authMiddleware, documentController.uploadDocument);
router.get('/my', authMiddleware, documentController.getMyDocuments);

module.exports = router;
