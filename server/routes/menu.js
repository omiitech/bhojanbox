const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Get all menu items with category name
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.id, m.name, m.description, m.price, m.image_url, c.name AS category
      FROM menu_items m
      JOIN categories c ON m.category_id = c.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ FIX: Make sure to export router
module.exports = router;
