const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'deportes_db',
    port: process.env.MYSQL_PORT || 3306
};

async function addSettingsColumn() {
    let connection;

    try {
        console.log('🔌 Conectando a la base de datos...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Conexión establecida\n');

        // 1. Add settings to leagues
        console.log('Checking leagues table...');
        const [leagueColumns] = await connection.execute(
            "SHOW COLUMNS FROM leagues LIKE 'settings'"
        );

        if (leagueColumns.length === 0) {
            console.log('Adding settings column to leagues table...');
            await connection.execute(
                "ALTER TABLE leagues ADD COLUMN settings JSON DEFAULT NULL"
            );
            console.log('✅ Column settings added to leagues.');
        } else {
            console.log('ℹ️ Column settings already exists in leagues.');
        }

        // 2. Add settings to tournaments
        console.log('\nChecking tournaments table...');
        const [tournamentColumns] = await connection.execute(
            "SHOW COLUMNS FROM tournaments LIKE 'settings'"
        );

        if (tournamentColumns.length === 0) {
            console.log('Adding settings column to tournaments table...');
            await connection.execute(
                "ALTER TABLE tournaments ADD COLUMN settings JSON DEFAULT NULL"
            );
            console.log('✅ Column settings added to tournaments.');
        } else {
            console.log('ℹ️ Column settings already exists in tournaments.');
        }

    } catch (error) {
        console.error('Error updating database:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Conexión cerrada');
        }
    }
}

addSettingsColumn();
