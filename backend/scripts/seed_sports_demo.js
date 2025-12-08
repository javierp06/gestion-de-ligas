const { getPool } = require('../src/config/mysql');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuration for Demo Data
const DEMO_ORG_EMAIL = 'demo@organizer.com';
const SPORTS_DATA = [
    { name: 'Fútbol', players: 11, icon: 'sports_soccer' },
    { name: 'Fútbol 7', players: 7, icon: 'sports_soccer' },
    { name: 'Baloncesto', players: 5, icon: 'sports_basketball' },
    { name: 'Tenis', players: 1, icon: 'sports_tennis' },
    { name: 'Pádel', players: 2, icon: 'sports_tennis' },
    { name: 'Golf', players: 1, icon: 'golf_course' },
    { name: 'Voleibol', players: 6, icon: 'sports_volleyball' },
];

const LEAGUES_DATA = [
    { sport: 'Fútbol 7', name: 'Liga Rápida Nocturna', location: 'Centro Deportivo Central', teams: 8, prefix: 'F7' },
    { sport: 'Baloncesto', name: 'Liga Pro Basket', location: 'Arena Municipal', teams: 10, prefix: 'BKT' },
    { sport: 'Tenis', name: 'Grand Slam Nacional', location: 'Club de Tenis Elite', teams: 16, prefix: 'P', naming: 'Player' },
    { sport: 'Pádel', name: 'Padel Tour Master', location: 'Padel Club Pro', teams: 12, prefix: 'Pair', naming: 'Duo' },
    { sport: 'Golf', name: 'Club Championship', location: 'Green Valley Golf', teams: 20, prefix: 'G', naming: 'Golfer' },
    { sport: 'Voleibol', name: 'Super Liga Voley', location: 'Gimnasio Olimpico', teams: 8, prefix: 'VOL' },
];

const seedSports = async () => {
    // Create standalone connection to avoid "pool not initialized" issues with app code
    const pool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT || 3306,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        waitForConnections: true,
        connectionLimit: 1
    });

    try {
        console.log('Starting seed process...');

        // 1. Ensure Sports Exist
        const sportIds = {};
        for (const sport of SPORTS_DATA) {
            await pool.query(
                `INSERT INTO sports (name, players_per_team, icon) 
                 SELECT ?, ?, ? WHERE NOT EXISTS (SELECT * FROM sports WHERE name = ?)`,
                [sport.name, sport.players, sport.icon, sport.name]
            );

            const [rows] = await pool.query('SELECT id FROM sports WHERE name = ?', [sport.name]);
            sportIds[sport.name] = rows[0].id;
        }
        console.log('Sports checked/created.');

        // 2. Get or Create Organizer
        let organizerId;
        const [users] = await pool.query('SELECT id FROM users WHERE email = ?', [DEMO_ORG_EMAIL]);
        if (users.length > 0) {
            organizerId = users[0].id;
        } else {
            // Create dummy organizer
            const [res] = await pool.query(
                `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
                ['Demo Organizer', DEMO_ORG_EMAIL, '$2b$10$EpIx.ff./..', 'organizer'] // Hash for 'password', likely won't work for login but fine for FK
            );
            organizerId = res.insertId;
        }

        // 3. Create Leagues and Teams
        for (const leagueDef of LEAGUES_DATA) {
            const sportId = sportIds[leagueDef.sport];

            // Create League
            const [lRes] = await pool.query(
                `INSERT INTO leagues (name, description, sport_id, organizer_id, location, status) 
                 VALUES (?, ?, ?, ?, ?, 'active')`,
                [leagueDef.name, `Liga profesional de ${leagueDef.sport}`, sportId, organizerId, leagueDef.location]
            );
            const leagueId = lRes.insertId;
            console.log(`Created League: ${leagueDef.name} (ID: ${leagueId})`);

            // Create Teams
            for (let i = 1; i <= leagueDef.teams; i++) {
                let teamName;
                if (leagueDef.naming === 'Player') {
                    teamName = `Jugador ${i}`;
                } else if (leagueDef.naming === 'Duo') {
                    teamName = `Pareja ${i}`;
                } else if (leagueDef.naming === 'Golfer') {
                    teamName = `Golfista ${i}`;
                } else {
                    teamName = `${leagueDef.prefix} Team ${i}`;
                }

                await pool.query(
                    `INSERT INTO teams (name, short_name, league_id, founded_date, stadium)
                     VALUES (?, ?, ?, NOW(), ?)`,
                    [teamName, `${leagueDef.prefix}${i}`, leagueId, leagueDef.location]
                );
            }
            console.log(`  - Added ${leagueDef.teams} teams.`);
        }

        console.log('Seeding completed successfully!');
        await pool.end();
        process.exit(0);

    } catch (error) {
        console.error('Seeding failed:', error);
        await pool.end();
        process.exit(1);
    }
};

seedSports();
