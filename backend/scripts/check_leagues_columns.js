const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mysql = require('mysql2/promise');

async function checkColumns() {
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

        console.log('Checking leagues table columns...');
        const [columns] = await connection.query(`SHOW COLUMNS FROM leagues`);
        
        const hasCover = columns.some(c => c.Field === 'cover_photo');
        const hasLogo = columns.some(c => c.Field === 'logo');

        console.log('Columns found:');
        columns.forEach(c => console.log(`- ${c.Field} (${c.Type})`));

        if (hasCover && hasLogo) {
            console.log('\nSUCCESS: Both logo and cover_photo columns exist.');
        } else {
            console.log('\nERROR: Missing columns.');
            if (!hasCover) console.log('- cover_photo is missing');
            if (!hasLogo) console.log('- logo is missing');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (connection) await connection.end();
    }
}

checkColumns();
