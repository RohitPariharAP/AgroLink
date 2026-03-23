// server/controllers/auth.controller.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token lasts for 30 days
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, phone, password, role, location, crops, language } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this phone number already exists" });
    }

    // 2. Create the user
    const user = await User.create({
      name,
      phone,
      password, // This gets hashed automatically by our Mongoose pre-save hook!
      role,
      location,
      crops,
      language,
    });

    // 3. If user is created successfully, send back data + token
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        language: user.language,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data received" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Authenticate a user (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // 1. Find user by phone number
    // We must use .select('+password') because we hid it by default in the schema
    const user = await User.findOne({ phone }).select("+password");

    // 2. Check if user exists AND password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        rewardPoints: user.rewardPoints,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid phone number or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
