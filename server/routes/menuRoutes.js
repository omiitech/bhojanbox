const express = require('express');
const router = express.Router();
const pool = require('../db');

// Enable CORS for all routes
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// GET all menu items with category information
router.get('/', async (req, res) => {
  console.log('GET /api/menu - Request received');
  try {
    const result = await pool.query(`
      SELECT m.*, c.name AS category_name, c.description AS category_description
      FROM menu_items m
      JOIN menu_categories c ON m.category_id = c.id
      ORDER BY m.id ASC
    `);
    
    console.log(`Found ${result.rows.length} menu items`);
    
    // Transform the data to match the client's expected format
    const menuItems = result.rows.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      image_url: item.image_url || 'https://via.placeholder.com/300x200?text=Food+Image',
      category_name: item.category_name,
      is_vegetarian: item.is_vegetarian || false,
      is_vegan: item.is_vegan || false,
      is_gluten_free: item.is_gluten_free || false
    }));
    
    res.json(menuItems);
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to fetch menu items',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// GET a single menu item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT m.*, c.name AS category_name FROM menu_items m JOIN menu_categories c ON m.category_id = c.id WHERE m.id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Menu item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching menu item:', err);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to fetch menu item',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;
