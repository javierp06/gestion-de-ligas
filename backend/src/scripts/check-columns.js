require('dotenv').config();
const { connectMySQL, getPool } = require('../config/mysql');

const checkColumns = async () => {
    try {
        await connectMySQL();
        const pool = getPool();
        const [columns] = await pool.query("SHOW COLUMNS FROM tournaments");
        console.log(columns.map(c => c.Field));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkColumns();
