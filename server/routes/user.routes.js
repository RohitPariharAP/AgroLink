// server/routes/user.routes.js
const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { updateProfile } = require('../controllers/user.controller');

router.get('/:id', protect, getUserProfile);
router.put('/profile', protect, upload.single('avatar'), updateProfile);

module.exports = router;