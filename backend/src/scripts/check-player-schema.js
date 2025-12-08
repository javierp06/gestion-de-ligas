require('dotenv').config();
const { connectMySQL, getPool } = require('../config/mysql');

const checkSchema = async () => {
    try {
        await connectMySQL();
        const pool = getPool();
        const [columns] = await pool.query('SHOW COLUMNS FROM players');
        console.log('Players table columns:', columns.map(c => c.Field));
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkSchema();
