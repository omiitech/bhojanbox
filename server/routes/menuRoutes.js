const express = require('express');
const router = express.Router();
const pool = require('../db'); // adjust path if your db file is elsewhere

// GET all menu items
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM menu_items ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
