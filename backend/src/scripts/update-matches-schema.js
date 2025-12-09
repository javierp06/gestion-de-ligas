require('dotenv').config();
const { connectMySQL, getPool } = require('../config/mysql');

const updateMatchesSchema = async () => {
    try {
        await connectMySQL();
        const pool = getPool();
        const connection = await pool.getConnection();

        console.log('Altering matches table...');

        // Add stage column
        try {
            await connection.query("ALTER TABLE matches ADD COLUMN stage ENUM('regular_season', 'round_of_16', 'quarter_final', 'semi_final', 'final', 'third_place') DEFAULT 'regular_season' AFTER status");
            console.log('stage column added');
        } catch (e) { console.log('stage column add error (might exist):', e.message); }

        console.log('Schema update complete.');
        connection.release();
        process.exit(0);

    } catch (error) {
        console.error('Fatal Error:', error);
        process.exit(1);
    }
};

updateMatchesSchema();
