const { Pool } = require('pg');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Database configuration
const config = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'bhojanbox',
  password: process.env.DB_PASS || 'post@123',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  max: 10, // Reduced max clients for development
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, // Increased timeout
};

// Create a new pool
const pool = new Pool(config);

// Handle connection errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  // Don't exit the process in production, just log the error
  if (process.env.NODE_ENV !== 'production') {
    process.exit(-1);
  }
});

// Test the connection
const testConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL database');
    console.log('   Database time:', result.rows[0].now);
  } catch (err) {
    console.error('❌ Error connecting to the database:', err.message);
    console.error('   Make sure PostgreSQL is running and your .env file is configured correctly.');
    console.error('   Current configuration:', {
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
    });
    throw err;
  } finally {
    if (client) client.release();
  }
};

// Test the connection when this module is loaded
if (process.env.NODE_ENV !== 'test') {
  testConnection().catch(err => {
    console.error('Database connection failed:', err.message);
  });
}

module.exports = {
  query: (text, params) => {
    console.log('Executing query:', { text, params });
    return pool.query(text, params);
  },
  getClient: () => pool.connect(),
  pool,
};
