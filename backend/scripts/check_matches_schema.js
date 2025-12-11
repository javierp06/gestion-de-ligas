require('dotenv').config();
const { connectMySQL, getPool } = require('../src/config/mysql');

async function checkMatchesSchema() {
  try {
    await connectMySQL();
    const pool = getPool();
    
    const [columns] = await pool.query('SHOW COLUMNS FROM matches');
    console.log('Matches Table Columns:');
    columns.forEach(c => console.log(`- ${c.Field} (${c.Type})`));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkMatchesSchema();