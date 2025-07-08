const { pool } = require('./config/database');

async function checkSchema() {
  const client = await pool.connect();
  try {
    // Get table structure
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'menu_items';
    `);
    
    console.log('Current menu_items schema:');
    console.table(result.rows);
    
    // Get sample data
    const sampleData = await client.query('SELECT * FROM menu_items LIMIT 1');
    console.log('\nSample data (first row):');
    console.log(sampleData.rows[0] || 'No data in menu_items table');
    
  } catch (error) {
    console.error('Error checking schema:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkSchema();
