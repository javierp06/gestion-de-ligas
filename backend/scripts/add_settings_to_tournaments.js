const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mysql = require('mysql2/promise');

async function addSettingsColumn() {
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

        console.log('Checking if settings column exists in tournaments table...');
        const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'tournaments' AND COLUMN_NAME = 'settings'
    `, [process.env.MYSQL_DATABASE]);

        if (columns.length > 0) {
            console.log('Settings column already exists.');
        } else {
            console.log('Adding settings column to tournaments table...');
            await connection.query(`
        ALTER TABLE tournaments
        ADD COLUMN settings JSON DEFAULT NULL AFTER max_teams
      `);
            console.log('Settings column added successfully.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Connection closed.');
        }
    }
}

addSettingsColumn();
