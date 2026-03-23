// server/controllers/user.controller.js
const User = require('../models/User');
const Post = require('../models/Post');
const Product = require('../models/Product');

const getUserProfile = async (req, res) => {
  try {
    // Fetch the user, excluding their password
    const userProfile = await User.findById(req.params.id).select('-password');
    if (!userProfile) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch all forum posts written by this user
    const posts = await Post.find({ author: req.params.id })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    // Fetch all marketplace items listed by this user
    const products = await Product.find({ seller: req.params.id })
      .populate('seller', 'name location')
      .sort({ createdAt: -1 });

    res.json({ user: userProfile, posts, products });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};


const updateProfile = async (req, res) => {
  try {
    const updateData = {};
    
    // If a file was uploaded, Cloudinary will give us the secure URL in req.file.path
    if (req.file) {
      updateData.avatar = req.file.path;
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true } // Return the updated document
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

module.exports = { getUserProfile , updateProfile};