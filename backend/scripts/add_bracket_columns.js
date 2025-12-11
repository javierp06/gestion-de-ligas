require('dotenv').config();
const { connectMySQL, getPool } = require('../src/config/mysql');

async function addBracketColumns() {
  try {
    await connectMySQL();
    const pool = getPool();
    
    console.log('Adding bracket columns to matches table...');
    
    // Check if columns exist first to avoid errors
    const [columns] = await pool.query('SHOW COLUMNS FROM matches');
    const hasNextMatchId = columns.some(c => c.Field === 'next_match_id');
    
    if (!hasNextMatchId) {
        await pool.query(`
            ALTER TABLE matches 
            ADD COLUMN next_match_id INT NULL,
            ADD COLUMN next_match_slot ENUM('home', 'away') NULL,
            ADD CONSTRAINT fk_next_match FOREIGN KEY (next_match_id) REFERENCES matches(id) ON DELETE SET NULL
        `);
        console.log('SUCCESS: Added next_match_id and next_match_slot columns.');
    } else {
        console.log('INFO: Columns already exist.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addBracketColumns();