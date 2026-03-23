// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); 
const { Server } = require('socket.io'); 

// --- MODELS (Imported ONCE at the top for performance) ---
const Message = require('./models/Message');
const Notification = require('./models/Notification');
const User = require('./models/User');

// --- ROUTES ---
const userRoutes = require('./routes/user.routes');  
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const productRoutes = require('./routes/product.routes');
const scannerRoutes = require('./routes/scanner.routes');
const chatRoutes = require('./routes/chat.routes'); 
const notificationRoutes = require('./routes/notification.routes'); 

const app = express();

// --- MIDDLEWARE ---
app.use(express.json());
app.use(cors()); // Allows your Vercel frontend to talk to this Render backend
app.use(express.urlencoded({ extended: true }));

// --- SOCKET.IO SETUP ---
// Wrap Express in an HTTP Server so Socket.io can attach to it
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// Make 'io' globally available to your controllers (e.g., req.app.get('io'))
app.set('io', io);

// --- REAL-TIME SOCKET LOGIC ---
io.on('connection', (socket) => {
  console.log('⚡ A user connected to real-time engine:', socket.id);

  // 1. Join personal room based on their MongoDB User ID
  socket.on('join', (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`User ${userId} joined their personal room.`);
    }
  });

  // 2. Handle sending messages & triggering notifications
  socket.on('sendMessage', async (data) => {
    try {
      // Safety Check: Prevent server crash if data is missing
      if (!data.senderId || !data.receiverId || !data.content) {
        console.error('Socket Error: Missing message data');
        return; 
      }

      // 1. Save Chat Message to DB permanently
      const savedMessage = await Message.create({
        sender: data.senderId,
        receiver: data.receiverId,
        content: data.content
      });

      // 2. Fetch sender's name to make the notification look nice
      const sender = await User.findById(data.senderId).select('name');
      const senderName = sender ? sender.name : 'A Farmer';

      // 3. Create a Notification in the DB (For offline users)
      const notif = await Notification.create({
        recipient: data.receiverId,
        message: `New message from ${senderName}`,
        type: 'message',
        link: '/chat'
      });

      // 4. Fire them both off instantly to the receiver's room
      io.to(data.receiverId).emit('receiveMessage', savedMessage);
      io.to(data.receiverId).emit('newNotification', notif);
      
    } catch (error) {
      console.error('Socket message processing failed:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected from socket:', socket.id);
  });
});

// --- MOUNT ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/posts', postRoutes);
app.use('/api/products', productRoutes);
app.use('/api/scanner', scannerRoutes);
app.use('/api/chat', chatRoutes); 
app.use('/api/notifications', notificationRoutes); 

// --- DATABASE CONNECTION & SERVER BOOT ---
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    
    // IMPORTANT: Use server.listen so both Express API and Socket.io run together
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error);
  });