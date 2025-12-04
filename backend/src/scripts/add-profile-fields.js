require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '1234',
    database: process.env.MYSQL_DATABASE || 'deportes_db'
};

async function addProfileFields() {
    let connection;
    try {
        console.log('🔌 Conectando a la base de datos...');
        connection = await mysql.createConnection(dbConfig);

        console.log('🔍 Verificando columnas en tabla users...');
        const [columns] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'
        `, [dbConfig.database]);

        const existingColumns = columns.map(c => c.COLUMN_NAME);

        // Add bio column
        if (!existingColumns.includes('bio')) {
            console.log('📝 Agregando columna bio...');
            await connection.query(`
                ALTER TABLE users 
                ADD COLUMN bio TEXT NULL AFTER avatar
            `);
            console.log('✅ Columna bio agregada.');
        } else {
            console.log('ℹ️ Columna bio ya existe.');
        }

        // Add location column
        if (!existingColumns.includes('location')) {
            console.log('📝 Agregando columna location...');
            await connection.query(`
                ALTER TABLE users 
                ADD COLUMN location VARCHAR(100) NULL AFTER bio
            `);
            console.log('✅ Columna location agregada.');
        } else {
            console.log('ℹ️ Columna location ya existe.');
        }

        console.log('✨ Migración completada exitosamente.');

    } catch (error) {
        console.error('❌ Error durante la migración:', error);
    } finally {
        if (connection) await connection.end();
    }
}

addProfileFields();
