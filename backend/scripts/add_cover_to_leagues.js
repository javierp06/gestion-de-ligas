const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mysql = require('mysql2/promise');

async function addCoverColumn() {
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

        console.log('Checking leagues table for cover_photo column...');
        
        // Check if column exists
        const [columns] = await connection.query(`
            SHOW COLUMNS FROM leagues LIKE 'cover_photo'
        `);

        if (columns.length === 0) {
            console.log('Adding cover_photo column...');
            await connection.query(`
                ALTER TABLE leagues
                ADD COLUMN cover_photo VARCHAR(500) DEFAULT NULL AFTER logo
            `);
            console.log('Column added successfully.');
        } else {
            console.log('Column cover_photo already exists.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (connection) await connection.end();
    }
}

addCoverColumn();
