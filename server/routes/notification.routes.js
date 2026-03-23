// server/routes/notification.routes.js
const express = require('express');
const router = express.Router();
const { getMyNotifications, markAsRead } = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getMyNotifications);
router.put('/read', protect, markAsRead);

module.exports = router;