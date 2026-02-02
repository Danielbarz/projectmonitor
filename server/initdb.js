const fs = require('fs');
const path = require('path');
const pool = require('./db');

const initDatabase = async () => {
  try {
    console.log('🔧 Initializing Database...');

    const sqlFilePath = path.join(__dirname, 'database.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    await pool.query(sql);

    console.log('✅ Database initialized successfully!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    pool.end();
  }
};

initDatabase();