const fs = require('fs').promises;
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

const config = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'postgres', // Connect to default postgres DB first
  password: process.env.DB_PASSWORD || 'your_password',
  port: process.env.DB_PORT || 5432,
};

async function runMigrations() {
  const pool = new Pool(config);
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Create migrations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        run_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get all migration files
    const files = (await fs.readdir(MIGRATIONS_DIR))
      .filter(file => file.endsWith('.sql'))
      .sort();

    // Get already run migrations
    const { rows: completedMigrations } = await client.query(
      'SELECT name FROM migrations'
    );
    const completedMigrationNames = new Set(completedMigrations.map(m => m.name));

    // Run new migrations
    for (const file of files) {
      if (!completedMigrationNames.has(file)) {
        console.log(`Running migration: ${file}...`);
        
        const migrationSQL = await fs.readFile(
          path.join(MIGRATIONS_DIR, file),
          'utf8'
        );
        
        // Split the file into individual statements, handling semicolons within functions
        const statements = [];
        let currentStatement = '';
        let inFunction = false;
        
        for (const line of migrationSQL.split('\n')) {
          currentStatement += line + '\n';
          
          // Toggle function state when we see $$ or $function$
          if (line.includes('$$') || line.includes('$function$')) {
            inFunction = !inFunction;
          }
          
          // Only split on semicolons when not inside a function
          if (line.trim().endsWith(';') && !inFunction) {
            statements.push(currentStatement.trim());
            currentStatement = '';
          }
        }
        
        // Add any remaining content as a statement
        if (currentStatement.trim() !== '') {
          statements.push(currentStatement.trim());
        }

        // Execute each statement
        for (const statement of statements) {
          if (statement.trim() === '') continue;
          try {
            await client.query(statement);
          } catch (error) {
            console.error('Error executing statement:', statement);
            throw error;
          }
        }

        // Record the migration
        await client.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [file]
        );
        
        console.log(`✅ Completed migration: ${file}`);
      }
    }

    await client.query('COMMIT');
    console.log('✅ All migrations completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Create the database if it doesn't exist
async function ensureDatabaseExists() {
  const pool = new Pool({
    ...config,
    database: 'postgres' // Connect to default database
  });

  try {
    // Check if database exists
    const { rows } = await pool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME || 'bhojanbox']
    );

    if (rows.length === 0) {
      console.log('Creating database...');
      await pool.query(`CREATE DATABASE ${process.env.DB_NAME || 'bhojanbox'}`);
      console.log('✅ Database created');
    } else {
      console.log('✅ Database already exists');
    }
  } catch (error) {
    console.error('❌ Error ensuring database exists:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

async function main() {
  try {
    await ensureDatabaseExists();
    
    // Update config to use the actual database
    config.database = process.env.DB_NAME || 'bhojanbox';
    
    await runMigrations();
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
