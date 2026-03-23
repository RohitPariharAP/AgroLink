// server/routes/post.routes.js
const express = require('express');
const router = express.Router();
const { 
  createPost, 
  getPosts, 
  addComment, 
  getPostById, 
  deletePost, 
  toggleLike 
} = require('../controllers/post.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Base routes
router.route('/')
  .post(protect, upload.array('media', 4), createPost)
  .get(protect, getPosts);

// Single post routes (Get One, Delete One)
router.route('/:id')
  .get(protect, getPostById)
  .delete(protect, deletePost);

// Interaction routes
router.route('/:id/like')
  .put(protect, toggleLike);

router.route('/:id/comments')
  .post(protect, addComment);

module.exports = router;