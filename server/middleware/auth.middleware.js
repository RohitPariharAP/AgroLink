// server/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if the authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (Format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from the database (excluding the password) and attach it to the request
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move to the actual route controller
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };