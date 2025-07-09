const { Pool } = require('pg');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env') });

console.log('Database config:', {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'bhojanbox',
  port: process.env.DB_PORT || 5432,
});

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'bhojanbox',
  password: process.env.DB_PASS || 'post@123',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
});

// Test the connection
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Successfully connected to the database');
  }
});

module.exports = pool;
