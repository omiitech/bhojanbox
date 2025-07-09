const express = require('express');
const cors = require('cors');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'BhojanBox API is running',
    timestamp: new Date().toISOString()
  });
});

// Import routes
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');

// API routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Simple error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! ');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! ');
  console.error(err);
  process.exit(1);
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log(' SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log(' Process terminated!');
  });
});
