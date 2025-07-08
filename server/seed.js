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

    // Insert menu items with proper image paths
    const menuItems = [
      // Main Course
      {
        name: 'Paneer Tikka Masala',
        description: 'Grilled cottage cheese cubes in rich tomato and cream gravy',
        price: 249.99,
        image_url: '/images/paneertikka.png',
        category_id: categoryIds[0],
        is_vegetarian: true,
        is_vegan: false,
        is_gluten_free: true
      },
      {
        name: 'Butter Chicken',
        description: 'Tender chicken in a creamy tomato and butter sauce',
        price: 299.99,
        image_url: '/images/butter-chicken.jpg',
        category_id: categoryIds[0],
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: true
      },
      {
        name: 'Dal Makhani',
        description: 'Creamy black lentils slow-cooked with butter and spices',
        price: 199.99,
        image_url: '/images/dal-makhani.jpg',
        category_id: categoryIds[0],
        is_vegetarian: true,
        is_vegan: false,
        is_gluten_free: true
      },
      
      // Starters
      {
        name: 'Samosa',
        description: 'Crispy pastry filled with spiced potatoes and peas',
        price: 59.99,
        image_url: '/images/samosa.jpg',
        category_id: categoryIds[1],
        is_vegetarian: true,
        is_vegan: true,
        is_gluten_free: false
      },
      
      // Breads
      {
        name: 'Garlic Naan',
        description: 'Leavened bread with garlic and butter',
        price: 49.99,
        image_url: '/images/garlic-naan.jpg',
        category_id: categoryIds[2],
        is_vegetarian: true,
        is_vegan: false,
        is_gluten_free: false
      },
      
      // Desserts
      {
        name: 'Gulab Jamun',
        description: 'Sweet milk dumplings in sugar syrup',
        price: 99.99,
        image_url: '/images/gulab-jamun.jpg',
        category_id: categoryIds[3],
        is_vegetarian: true,
        is_vegan: false,
        is_gluten_free: false
      },
      
      // Beverages
      {
        name: 'Mango Lassi',
        description: 'Refreshing yogurt drink with mango',
        price: 79.99,
        image_url: '/images/mango-lassi.jpg',
        category_id: categoryIds[4],
        is_vegetarian: true,
        is_vegan: false,
        is_gluten_free: true
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
