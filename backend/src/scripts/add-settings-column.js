require('dotenv').config();
const { connectMySQL, getPool } = require('../config/mysql');

const updateTournamentsSchema = async () => {
    try {
        await connectMySQL();
        const pool = getPool();
        const connection = await pool.getConnection();

        console.log('Altering tournaments table...');

        // Add settings column
        try {
            await connection.query('ALTER TABLE tournaments ADD COLUMN settings JSON AFTER max_teams');
            console.log('settings column added');
        } catch (e) {
            // If JSON type is not supported (old mysql), use TEXT
            if (e.message.includes('check the manual')) {
                try {
                    await connection.query('ALTER TABLE tournaments ADD COLUMN settings TEXT AFTER max_teams');
                    console.log('settings column added (TEXT)');
                } catch (e2) {
                    console.log('settings column add error:', e2.message);
                }
            } else {
                console.log('settings column add error (might exist):', e.message);
            }
        }

        console.log('Schema update complete.');
        connection.release();
        process.exit(0);

    } catch (error) {
        console.error('Fatal Error:', error);
        process.exit(1);
    }
};

updateTournamentsSchema();
