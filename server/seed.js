const { pool } = require('./config/db');

async function seedDatabase() {
  const client = await pool.connect();

  try {
    console.log('📡 Connected to database:', process.env.DB_NAME);

    // Clear all existing data safely (child → parent)
    console.log('🧹 Truncating tables...');
    await client.query(`
      TRUNCATE TABLE order_items, orders, menu_items, menu_categories 
      RESTART IDENTITY CASCADE;
    `);

    // Insert categories
    const categories = [
      { name: 'Main Course', description: 'Hearty main dishes' },
      { name: 'Starter', description: 'Appetizers and small bites' },
      { name: 'Bread', description: 'Freshly baked breads' },
      { name: 'Dessert', description: 'Sweet treats' },
      { name: 'Beverage', description: 'Drinks and refreshments' }
    ];

    const categoryIds = [];

    console.log('🌱 Inserting categories...');
    for (const category of categories) {
      const result = await client.query(
        'INSERT INTO menu_categories(name, description) VALUES ($1, $2) RETURNING id',
        [category.name, category.description]
      );
      const id = result.rows[0].id;
      categoryIds.push(id);
      console.log(`✅ Inserted category: ${category.name} (id: ${id})`);
    }

    // Insert menu items
    const menuItems = [
      {
        name: 'Paneer Tikka',
        description: 'Spicy grilled paneer cubes',
        price: 199.99,
        image_url: 'https://i.imgur.com/1.jpg',
        category_id: categoryIds[0],
        is_vegetarian: true,
        is_vegan: false,
        is_gluten_free: false
      },
      {
        name: 'Butter Chicken',
        description: 'Creamy chicken curry',
        price: 299.99,
        image_url: 'https://i.imgur.com/2.jpg',
        category_id: categoryIds[0],
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: false
      },
      {
        name: 'Mango Lassi',
        description: 'Refreshing mango yogurt drink',
        price: 49.5,
        image_url: 'https://i.imgur.com/4.jpg',
        category_id: categoryIds[4],
        is_vegetarian: true,
        is_vegan: false,
        is_gluten_free: true
      },
      {
        name: 'Gulab Jamun',
        description: 'Sweet Indian dessert',
        price: 79.0,
        image_url: 'https://i.imgur.com/3.jpg',
        category_id: categoryIds[3],
        is_vegetarian: true,
        is_vegan: false,
        is_gluten_free: false
      },
      {
        name: 'Shev Tomato Bhaji',
        description: 'A spicy Maharashtrian dish made with crispy shev and tangy tomato gravy',
        price: 119.0,
        image_url: 'https://i.imgur.com/5.jpg',
        category_id: categoryIds[0],
        is_vegetarian: true,
        is_vegan: false,
        is_gluten_free: false
      }
    ];

    console.log('🍽️ Inserting menu items...');
    for (const item of menuItems) {
      const values = [
        item.name,
        item.description,
        item.price,
        item.image_url,
        item.category_id,
        item.is_vegetarian,
        item.is_vegan,
        item.is_gluten_free
      ];

      const result = await client.query(
        `INSERT INTO menu_items
        (name, description, price, image_url, category_id, is_vegetarian, is_vegan, is_gluten_free)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id`,
        values
      );

      console.log(`✅ Inserted item: ${item.name} (id: ${result.rows[0].id})`);
    }

    console.log('🎉 Done! All data seeded successfully.');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    client.release();
    console.log('🔌 Connection released');
  }
}

seedDatabase();
