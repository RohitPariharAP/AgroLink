// server/models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['message', 'forum', 'marketplace', 'system'],
    default: 'system'
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  link: { 
    type: String 
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);