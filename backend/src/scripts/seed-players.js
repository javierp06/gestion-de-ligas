require('dotenv').config();
const { connectMySQL, getPool } = require('../config/mysql');

const seedPlayers = async () => {
    try {
        await connectMySQL();
        const pool = getPool();
        const connection = await pool.getConnection();

        console.log('Fetching teams...');
        const [teams] = await connection.query('SELECT id, name FROM teams');
        console.log(`Found ${teams.length} teams.`);

        const positions = ['Portero', 'Defensa', 'Defensa', 'Defensa', 'Defensa', 'Mediocampista', 'Mediocampista', 'Mediocampista', 'Delantero', 'Delantero', 'Delantero'];
        // Ensure at least 15 players per team
        const targetSquadSize = 15;

        for (const team of teams) {
            const [players] = await connection.query('SELECT id FROM players WHERE team_id = ?', [team.id]);
            const currentCount = players.length;

            if (currentCount < targetSquadSize) {
                const needed = targetSquadSize - currentCount;
                console.log(`Team ${team.name} has ${currentCount} players. Seeding ${needed} more...`);

                // Get existing numbers to avoid duplicates
                const [existingNumbers] = await connection.query('SELECT number FROM players WHERE team_id = ?', [team.id]);
                const usedNumbers = new Set(existingNumbers.map(r => r.number));

                const values = [];
                for (let i = 0; i < needed; i++) {
                    const playerNum = i + 1 + currentCount; // Simple logic, might conflict if gaps
                    // Find a free number
                    let candidateNum = 1;
                    while (usedNumbers.has(candidateNum)) {
                        candidateNum++;
                    }
                    usedNumbers.add(candidateNum);

                    const posIndex = (candidateNum - 1) % positions.length;
                    const position = positions[posIndex] || 'Mediocampista';

                    const name = `Jugador ${candidateNum} ${team.name.substring(0, 3).toUpperCase()}`;

                    values.push([name, team.id, candidateNum, position, null, null]);
                }

                if (values.length > 0) {
                    await connection.query(
                        'INSERT INTO players (name, team_id, number, position, birth_date, photo) VALUES ?',
                        [values]
                    );
                }
            } else {
                console.log(`Team ${team.name} already has ${currentCount} players. Skipping.`);
            }
        }

        console.log('Seeding complete.');
        connection.release();
        process.exit(0);

    } catch (error) {
        console.error('Fatal Error:', error);
        process.exit(1);
    }
};

seedPlayers();
