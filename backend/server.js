const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const studentRoutes = require('./src/routes/studentRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// MongoDB lazy connection — cached between Vercel serverless invocations
let isConnected = false;
const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000
  });
  isConnected = true;
};

// Ensure DB is connected BEFORE any route runs
app.use(async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection error:', err.message);
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Student Management API is running' });
});

// Routes
app.use('/api/students', studentRoutes);

// Error handler
app.use(errorHandler);

// Local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
      process.exit(1);
    });
}

// Export for Vercel serverless
module.exports = app;
