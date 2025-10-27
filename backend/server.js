const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
require('dotenv').config();

// Temporary in-memory storage (replace with database later)
global.storage = {
  leads: [],
  emiCalculations: [],
  eligibilityScores: [],
  newsletterSubscriptions: []
};

const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 8001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration - Allow all origins for development
app.use(cors({
  origin: true, // Allow all origins
  credentials: true
}));

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'AHAM Housing Finance API'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server without database
const startServer = async () => {
  try {
    console.log('📦 Using in-memory storage (temporary)');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 AHAM Housing Finance API running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;