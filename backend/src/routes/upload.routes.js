const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const uploadMiddleware = require('../middlewares/upload.middleware');
const { authenticateToken: protect } = require('../middlewares/auth.middleware');

// POST /api/upload
// Protect this route so only authenticated users can upload
router.post('/', protect, uploadMiddleware.single('file'), uploadController.uploadImage);

module.exports = router;
