require('dotenv').config();
const { connectMySQL, getPool } = require('../config/mysql');

const updateSchema = async () => {
    try {
        await connectMySQL();
        const pool = getPool();
        const connection = await pool.getConnection();

        console.log('Altering players table...');

        // 1. Make user_id nullable
        try {
            await connection.query('ALTER TABLE players MODIFY user_id INT NULL');
            console.log('user_id made nullable');
        } catch (e) { console.log('user_id modify error (might already be done):', e.message); }

        // 2. Add name column
        try {
            await connection.query('ALTER TABLE players ADD COLUMN name VARCHAR(255) NOT NULL AFTER id');
            console.log('name column added');
        } catch (e) { console.log('name column add error:', e.message); }

        // 3. Add photo column
        try {
            await connection.query('ALTER TABLE players ADD COLUMN photo VARCHAR(500) AFTER birth_date');
            console.log('photo column added');
        } catch (e) {
            // try without 'AFTER birth_date' if birth_date doesn't exist yet
            try {
                await connection.query('ALTER TABLE players ADD COLUMN photo VARCHAR(500)');
                console.log('photo column added at end');
            } catch (e2) { console.log('photo column add error:', e2.message); }
        }

        // 4. Add birth_date column
        try {
            await connection.query('ALTER TABLE players ADD COLUMN birth_date DATE AFTER position');
            console.log('birth_date column added');
        } catch (e) { console.log('birth_date column add error:', e.message); }

        // 5. Add number column (if distinct from jersey_number, or rename)
        // Controller uses 'number', DB has 'jersey_number'. Let's ADD 'number' for compatibility with controller
        try {
            await connection.query('ALTER TABLE players ADD COLUMN number INT AFTER team_id');
            console.log('number column added');
        } catch (e) { console.log('number column add error:', e.message); }

        console.log('Schema update complete.');
        connection.release();
        process.exit(0);

    } catch (error) {
        console.error('Fatal Error:', error);
        process.exit(1);
    }
};

updateSchema();
