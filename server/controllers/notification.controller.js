// server/controllers/notification.controller.js
const Notification = require('../models/Notification');

// Get all notifications for the logged-in user
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20); // Get the 20 most recent
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark all notifications as read
const markAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: 'All marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getMyNotifications, markAsRead };