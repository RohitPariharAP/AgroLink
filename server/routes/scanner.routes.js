// server/routes/scanner.routes.js
const express = require('express');
const router = express.Router();
const { analyzeCrop } = require('../controllers/scanner.controller');
const { protect } = require('../middleware/auth.middleware');
const multer = require('multer');

// We use memory storage so we don't clog up your hard drive with scanner photos
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// The route expects a single file called 'image'
router.post('/analyze', protect, upload.single('image'), analyzeCrop);

module.exports = router;