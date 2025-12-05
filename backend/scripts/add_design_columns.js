const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mysql = require('mysql2/promise');

async function addDesignColumns() {
    let connection;
    try {
        const config = {
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            port: process.env.MYSQL_PORT || 3306
        };

        console.log('Connecting to database...');
        connection = await mysql.createConnection(config);

        const tables = ['teams', 'leagues', 'tournaments'];
        const columns = [
            { name: 'cover_photo', type: 'VARCHAR(500) DEFAULT NULL' },
            { name: 'primary_color', type: 'VARCHAR(7) DEFAULT NULL' }, // Hex code #RRGGBB
            { name: 'secondary_color', type: 'VARCHAR(7) DEFAULT NULL' }
        ];

        for (const table of tables) {
            console.log(`Checking table: ${table}`);

            for (const col of columns) {
                const [existing] = await connection.query(`
          SELECT COLUMN_NAME 
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?
        `, [process.env.MYSQL_DATABASE, table, col.name]);

                if (existing.length === 0) {
                    console.log(`Adding ${col.name} to ${table}...`);
                    await connection.query(`
            ALTER TABLE ${table}
            ADD COLUMN ${col.name} ${col.type}
          `);
                } else {
                    console.log(`${col.name} already exists in ${table}.`);
                }
            }
        }

        console.log('Migration completed successfully.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Connection closed.');
        }
    }
}

addDesignColumns();
