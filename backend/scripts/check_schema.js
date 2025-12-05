const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function checkTables() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            port: process.env.MYSQL_PORT
        });

        console.log('--- TEAMS ---');
        const [teamsCols] = await connection.query('DESCRIBE teams');
        console.log(teamsCols.map(c => `${c.Field} (${c.Type})`).join('\n'));

        console.log('\n--- LEAGUES ---');
        const [leaguesCols] = await connection.query('DESCRIBE leagues');
        console.log(leaguesCols.map(c => `${c.Field} (${c.Type})`).join('\n'));

        console.log('\n--- TOURNAMENTS ---');
        const [tournamentsCols] = await connection.query('DESCRIBE tournaments');
        console.log(tournamentsCols.map(c => `${c.Field} (${c.Type})`).join('\n'));

        await connection.end();
    } catch (err) {
        console.error(err);
    }
}

checkTables();
