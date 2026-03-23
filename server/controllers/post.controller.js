const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification'); // Needed for notifications

const createPost = async (req, res) => {
  try {
    const { title, content, type, tags } = req.body;
    const mediaUrls = req.files ? req.files.map(file => file.path) : [];

    const post = await Post.create({
      author: req.user._id,
      title,
      content,
      type,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      media: mediaUrls,
      location: {
        district: req.user.location?.district,
        state: req.user.location?.state
      }
    });

    const populatedPost = await Post.findById(post._id).populate('author', 'name role avatar');
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name role avatar location')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name role avatar location');
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'name role avatar')
      .sort({ createdAt: 1 });

    res.json({ post, comments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = await Comment.create({
      post: req.params.id,
      author: req.user._id,
      content: req.body.content
    });

    // --- NOTIFICATION ENGINE LOGIC ---
    if (post.author.toString() !== req.user._id.toString()) {
      const newNotif = await Notification.create({
        recipient: post.author,
        message: `${req.user.name} answered your question: "${post.title}"`,
        type: 'forum',
        link: `/forum/${post._id}`
      });

      const io = req.app.get('io');
      if (io) {
        io.to(post.author.toString()).emit('newNotification', newNotif);
      }
    }

    const populatedComment = await Comment.findById(comment._id).populate('author', 'name avatar role');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await post.deleteOne();
    await Comment.deleteMany({ post: req.params.id });
    res.json({ message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id.toString();
    const isLiked = post.upvotes.some(id => id.toString() === userId);

    if (isLiked) {
      post.upvotes = post.upvotes.filter(id => id.toString() !== userId);
    } else {
      post.upvotes.push(userId);
    }

    await post.save();
    res.json(post.upvotes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createPost, getPosts, getPostById, addComment, deletePost, toggleLike };