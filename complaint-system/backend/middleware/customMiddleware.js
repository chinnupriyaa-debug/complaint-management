import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ============================================
// CUSTOM MIDDLEWARE - Express Advanced Topic
// ============================================

// 1. Authentication Middleware
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'anna_university_secret_key_2024');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// 2. Role-based Access Control Middleware
export const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${roles.join(' or ')}` 
      });
    }
    next();
  };
};

// 3. Request Logger Middleware
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  
  // Add request timing
  req.requestTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - req.requestTime;
    console.log(`[${timestamp}] ${method} ${url} - Completed in ${duration}ms`);
  });
  
  next();
};

// 4. Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 5. Rate Limiter Middleware (Custom Implementation)
const requestCounts = new Map();

export const rateLimiter = (windowMs = 60000, maxRequests = 100) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    } else {
      const data = requestCounts.get(ip);
      
      if (now > data.resetTime) {
        data.count = 1;
        data.resetTime = now + windowMs;
      } else {
        data.count++;
      }
      
      if (data.count > maxRequests) {
        return res.status(429).json({ 
          message: 'Too many requests, please try again later' 
        });
      }
    }
    
    next();
  };
};

// 6. Validation Middleware
export const validateComplaint = (req, res, next) => {
  const { issue, priority, complaint } = req.body;
  
  const validIssues = [
    'Academic', 'Infrastructure', 'Library', 'Hostel', 
    'Canteen', 'Transportation', 'Lab Equipment', 
    'Wi-Fi/Internet', 'Examination', 'Other'
  ];
  
  const validPriorities = ['Low', 'Medium', 'High', 'Critical'];
  
  if (!issue || !validIssues.includes(issue)) {
    return res.status(400).json({ message: 'Invalid issue category' });
  }
  
  if (!priority || !validPriorities.includes(priority)) {
    return res.status(400).json({ message: 'Invalid priority level' });
  }
  
  if (!complaint || complaint.trim().length < 10) {
    return res.status(400).json({ 
      message: 'Complaint must be at least 10 characters long' 
    });
  }
  
  next();
};

// 7. CORS Custom Middleware
export const customCors = (allowedOrigins = ['http://localhost:3000', 'http://localhost:4200']) => {
  return (req, res, next) => {
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    
    next();
  };
};
