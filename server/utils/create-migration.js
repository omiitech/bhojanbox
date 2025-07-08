const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

// Ensure migrations directory exists
if (!fs.existsSync(MIGRATIONS_DIR)) {
  fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
}

// Get migration name from command line arguments or use a default
const migrationName = process.argv[2] || 'new_migration';
const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
const fileName = `${timestamp}_${migrationName.replace(/[^a-zA-Z0-9_]/g, '_')}.sql`;
const filePath = path.join(MIGRATIONS_DIR, fileName);

// Template for new migration
const template = `-- Migration: ${migrationName}
-- Created at: ${new Date().toISOString()}

-- Add your SQL migration here
-- Example:
-- CREATE TABLE IF NOT EXISTS table_name (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(255) NOT NULL,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );
`;

// Write the migration file
fs.writeFileSync(filePath, template);

console.log(`✅ Created new migration: ${fileName}`);
console.log(`📝 Edit file at: ${filePath}`);
