const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Basic order route
router.get('/', async (req, res) => {
  try {
    res.json({ message: 'Order routes are working' });
  } catch (error) {
    console.error('Error in order route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;