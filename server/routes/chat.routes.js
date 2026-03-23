// server/routes/chat.routes.js
const express = require('express');
const router = express.Router();
const { getChatHistory, getUsersToChat } = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/users', protect, getUsersToChat);
router.get('/:userId', protect, getChatHistory);

module.exports = router;