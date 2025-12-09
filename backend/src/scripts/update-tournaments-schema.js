require('dotenv').config();
const { connectMySQL, getPool } = require('../config/mysql');

const updateTournamentSchema = async () => {
    try {
        await connectMySQL();
        const pool = getPool();
        const connection = await pool.getConnection();

        console.log('Altering tournaments table...');

        // Add logo column
        try {
            await connection.query('ALTER TABLE tournaments ADD COLUMN logo VARCHAR(500) AFTER description');
            console.log('logo column added');
        } catch (e) { console.log('logo column add error (might exist):', e.message); }

        // Add cover_photo column
        try {
            await connection.query('ALTER TABLE tournaments ADD COLUMN cover_photo VARCHAR(500) AFTER logo');
            console.log('cover_photo column added');
        } catch (e) { console.log('cover_photo column add error (might exist):', e.message); }


        console.log('Schema update complete.');
        connection.release();
        process.exit(0);

    } catch (error) {
        console.error('Fatal Error:', error);
        process.exit(1);
    }
};

updateTournamentSchema();
