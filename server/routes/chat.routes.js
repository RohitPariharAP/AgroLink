// server/routes/chat.routes.js
const express = require('express');
const router = express.Router();
// Import the new sendMessage function here
const { getChatHistory, getUsersToChat, sendMessage } = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/users', protect, getUsersToChat);
router.get('/:userId', protect, getChatHistory);

// ADD THIS NEW ROUTE:
router.post('/send', protect, sendMessage);

module.exports = router;