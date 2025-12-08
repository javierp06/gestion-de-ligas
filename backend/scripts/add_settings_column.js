const mysql = require('mysql2/promise');
require('dotenv').config();

const addSettingsColumn = async () => {
    let connection;
    try {
        console.log('Connecting to MySQL...');
        connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT || 3306,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });

        console.log('Checking leagues table for settings column...');

        const [columns] = await connection.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'leagues' AND COLUMN_NAME = 'settings'
    `, [process.env.MYSQL_DATABASE]);

        if (columns.length === 0) {
            console.log('Adding settings column to leagues table...');
            // JSON type is supported in MySQL 5.7+
            await connection.query(`ALTER TABLE leagues ADD COLUMN settings JSON DEFAULT NULL`);
            console.log('Column added successfully.');
        } else {
            console.log('Settings column already exists.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error adding settings column:', error);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
};

addSettingsColumn();
