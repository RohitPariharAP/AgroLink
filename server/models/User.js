// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please add a name'] 
  },
  phone: { 
    type: String, 
    required: [true, 'Please add a phone number'],
    unique: true,
    match: [/^\d{10}$/, 'Please add a valid 10-digit phone number']
  },
  password: { 
    type: String, 
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false // When we query users, don't return the password by default
  },
  role: { 
    type: String, 
    enum: ['farmer', 'expert', 'admin'], 
    default: 'farmer' 
  },
  location: {
    village: String,
    district: String,
    state: String
  },
  crops: [String],
  avatar: String,
  rewardPoints: { 
    type: Number, 
    default: 0 
  },
  language: { 
    type: String, 
    enum: ['hi', 'en'], 
    default: 'hi' 
  }
}, { timestamps: true });

// Pre-save middleware to hash password
// Pre-save middleware to hash password
userSchema.pre('save', async function() {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return; // Just return, no need for next()
  }

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check if entered password matches the hashed password in DB
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);