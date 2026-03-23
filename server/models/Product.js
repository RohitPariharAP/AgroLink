// server/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['Equipment', 'Seeds', 'Fertilizers', 'Crops', 'Other'], 
    required: true 
  },
  condition: {
    type: String,
    enum: ['New', 'Good', 'Fair', 'Used'],
    default: 'Good'
  },
  images: [String], // Array of Cloudinary URLs
  location: {
    district: String,
    state: String
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);