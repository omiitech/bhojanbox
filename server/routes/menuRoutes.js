const express = require('express');
const router = express.Router();
const pool = require('../db'); // adjust path if your db file is elsewhere

// GET all menu items with category information
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, c.name AS category_name, c.description AS category_description
      FROM menu_items m
      JOIN menu_categories c ON m.category_id = c.id
      ORDER BY m.id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

module.exports = router;
