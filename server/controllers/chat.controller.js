// server/controllers/chat.controller.js
const Message = require('../models/Message');
const User = require('../models/User');

const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params; 
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId }
      ]
    }).sort({ createdAt: 1 }); 

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
  }
};

const getUsersToChat = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('name avatar role location');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// ADD THIS NEW FUNCTION:
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    
    // Create and save the message to MongoDB
    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content: content
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save message', error: error.message });
  }
};

// DON'T FORGET TO EXPORT IT!
module.exports = { getChatHistory, getUsersToChat, sendMessage };