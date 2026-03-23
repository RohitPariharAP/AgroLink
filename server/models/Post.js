// server/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['question', 'article', 'tip'], 
    default: 'question' 
  },
  title: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  media: [String], // Array of image URLs (Cloudinary)
  tags: [String],  // e.g., ['Wheat', 'Disease', 'Madhya Pradesh']
  upvotes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  isResolved: { 
    type: Boolean, 
    default: false 
  },
  location: {
    district: String,
    state: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);