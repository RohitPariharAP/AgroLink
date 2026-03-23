// server/controllers/chat.controller.js
const Message = require('../models/Message');
const User = require('../models/User');

// Get chat history between the logged-in user and another specific user
const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params; // The person we are chatting with
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId }
      ]
    }).sort({ createdAt: 1 }); // Oldest to newest

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
  }
};

// Get a list of all users to start a chat with (For demo purposes)
const getUsersToChat = async (req, res) => {
  try {
    // Return all users EXCEPT the currently logged-in user
    const users = await User.find({ _id: { $ne: req.user._id } }).select('name avatar role location');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

module.exports = { getChatHistory, getUsersToChat };