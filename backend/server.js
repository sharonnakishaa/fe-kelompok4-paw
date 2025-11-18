const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { connectDB } = require('./config/dbConnection');
const dotenv = require('dotenv').config();
const cors = require('cors');
const passport = require('passport');
require('./config/passport');  
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 5001;

// Middleware untuk koneksi database di setiap request (untuk serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection error:', err.message);
    // Lanjutkan ke error handler
    next(err);
  }
});

// Initialize Passport (tanpa session untuk serverless)
app.use(passport.initialize());

// Debug middleware (hanya untuk development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log('Request URL:', req.url);
    console.log('Auth Header:', req.headers.authorization);
    console.log('User:', req.user);
    next();
  });
}

app.get('/', (_,res) => res.send('OK - Backend running on Vercel'));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: error.message
    });
  }
});

// Security & Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:5001',
      'https://kelompok4-paw.netlify.app',
    ];
    
    // Allow all Vercel preview/production deployments
    if (origin.includes('.vercel.app') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" },
  frameguard: false // Disable X-Frame-Options untuk allow iframe
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static folder for uploads
app.use('/uploads', express.static('uploads'));

// ================== ROUTES ==================
const routes = require('./routes');
app.use('/', routes);

// ================== ERROR HANDLER ==================
app.use(errorHandler);

// Cek variabel lingkungan yang diperlukan (warning only di serverless)
const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'EMAIL_USER',
  'EMAIL_PASS',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'FRONTEND_URL'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.warn(`Missing required environment variable: ${varName}`);
  }
});

// Start server (hanya untuk local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port: ${port}`);
  });
}

// Export untuk Vercel serverless
module.exports = app;
