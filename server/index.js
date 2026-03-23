// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // Required for Socket.io
const { Server } = require('socket.io'); // Required for Socket.io
const userRoutes = require('./routes/user.routes');  
// Import Routes
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const productRoutes = require('./routes/product.routes');
const scannerRoutes = require('./routes/scanner.routes');
const chatRoutes = require('./routes/chat.routes'); // NEW Chat Route
const notificationRoutes = require('./routes/notification.routes'); // NEW Notification Route

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Wrap Express in HTTP Server for Socket.io
const server = http.createServer(app);

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace if your React app runs on a different port
    methods: ["GET", "POST"]
  }
});

// THE MAGIC LINE: Makes 'io' globally available to your controllers (like post.controller)
app.set('io', io);

// Socket.IO Logic
io.on('connection', (socket) => {
  console.log('⚡ A user connected to real-time engine:', socket.id);

  // Join personal room based on User ID
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room.`);
  });

  // Handle sending messages & triggering notifications
  socket.on('sendMessage', async (data) => {
    try {
      const Message = require('./models/Message');
      const Notification = require('./models/Notification');
      const User = require('./models/User');

      // 1. Save Chat Message to DB
      const savedMessage = await Message.create({
        sender: data.senderId,
        receiver: data.receiverId,
        content: data.content
      });

      // 2. Fetch sender name for the notification
      const sender = await User.findById(data.senderId);

      // 3. Create a Notification in the DB for the offline/history fallback
      const notif = await Notification.create({
        recipient: data.receiverId,
        message: `New message from ${sender.name}`,
        type: 'message',
        link: '/chat'
      });

      // 4. Emit BOTH the chat message and the notification to the receiver's room instantly
      io.to(data.receiverId).emit('receiveMessage', savedMessage);
      io.to(data.receiverId).emit('newNotification', notif);
      
    } catch (error) {
      console.error('Socket message error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/products', productRoutes);
app.use('/api/scanner', scannerRoutes);
app.use('/api/chat', chatRoutes); // Mounted
app.use('/api/notifications', notificationRoutes); // Mounted
app.use('/api/users', userRoutes); // Mounted User Routes

// Database Connection & Server Start
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
    // IMPORTANT: Use server.listen instead of app.listen to keep Socket.IO alive
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error);
  });