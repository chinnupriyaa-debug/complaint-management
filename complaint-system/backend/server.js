// ============================================
// ANNA UNIVERSITY - COMPLAINT MANAGEMENT SYSTEM
// Backend Server with Express.js
// ============================================

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import complaintRoutes from './routes/complaints.js';

// Import custom middleware
import { 
  requestLogger, 
  errorHandler, 
  rateLimiter,
  customCors 
} from './middleware/customMiddleware.js';

// Import worker manager
import { workerManager } from './workers/workerManager.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Socket.IO for real-time updates
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:4200'],
    methods: ['GET', 'POST']
  }
});

// ============================================
// CUSTOM MIDDLEWARE USAGE
// ============================================

// 1. Request Logger
app.use(requestLogger);

// 2. Custom CORS
app.use(customCors(['http://localhost:3000', 'http://localhost:4200']));

// 3. Rate Limiter (100 requests per minute)
app.use(rateLimiter(60000, 100));

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (also keeping standard cors for fallback)
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4200'],
  credentials: true
}));

// ============================================
// DATABASE CONNECTION
// ============================================

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anna_complaints';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    console.log('📊 Database: anna_complaints');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// ============================================
// ROUTES
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Anna University Complaint Management System is running',
    timestamp: new Date().toISOString(),
    pendingAlerts: workerManager.getPendingAlertCount()
  });
});

// ============================================
// SOCKET.IO - Real-time Communication
// ============================================

io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);

  // Join room based on user role
  socket.on('join-room', (data) => {
    const { role, userId } = data;
    socket.join(role);
    socket.join(userId);
    console.log(`User ${userId} joined room: ${role}`);
  });

  // New complaint notification
  socket.on('new-complaint', (complaint) => {
    io.to('faculty').emit('complaint-notification', complaint);
  });

  // Complaint response notification
  socket.on('complaint-response', (data) => {
    io.to(data.studentId).emit('response-notification', data);
  });

  // Alert notification
  socket.on('alert-faculty', (data) => {
    io.to('faculty').emit('urgent-alert', data);
  });

  socket.on('disconnect', () => {
    console.log('👤 User disconnected:', socket.id);
  });
});

// Make io accessible in routes
app.set('io', io);

// ============================================
// ERROR HANDLER (Custom Middleware)
// ============================================

app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ============================================
// SERVER START
// ============================================

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   ANNA UNIVERSITY COMPLAINT MANAGEMENT SYSTEM  ║');
  console.log('╠════════════════════════════════════════════════╣');
  console.log(`║   Server running on port ${PORT}                  ║`);
  console.log('║   API: http://localhost:5000/api                ║');
  console.log('╚════════════════════════════════════════════════╝');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  workerManager.cleanup();
  httpServer.close(() => {
    mongoose.connection.close(false, () => {
      console.log('Server closed. Database connection closed.');
      process.exit(0);
    });
  });
});
