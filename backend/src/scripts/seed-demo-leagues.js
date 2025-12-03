const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'deportes_db',
  port: process.env.MYSQL_PORT || 3306
};

async function seedDemoLeagues() {
  let connection;

  try {
    console.log('🔌 Conectando a la base de datos...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Conexión establecida\n');

    // Buscar el organizador demo
    const [organizers] = await connection.execute(
      `SELECT id, email FROM users WHERE email = 'org@proleague.com'`
    );

    if (organizers.length === 0) {
      console.error('Error: No existe el usuario org@proleague.com');
      console.log('💡 Ejecuta primero: node src/scripts/seed-demo-users.js');
      process.exit(1);
    }

    const organizerId = organizers[0].id;
    console.log(`👤 Organizador: ${organizers[0].email} (ID: ${organizerId})\n`);

    // Verificar deportes disponibles
    const [sports] = await connection.execute(
      'SELECT id, name FROM sports ORDER BY id'
    );

    if (sports.length === 0) {
      console.error('Error: No hay deportes en la base de datos');
      console.log('💡 Ejecuta: POST http://localhost:3001/api/sports/seed');
      process.exit(1);
    }

    console.log(`⚽ Deportes disponibles: ${sports.length}`);
    sports.forEach(sport => console.log(`   - ${sport.name} (ID: ${sport.id})`));
    console.log('');

    // Buscar IDs de Fútbol y Baloncesto
    const futbolId = sports.find(s => s.name === 'Fútbol')?.id || 1;
    const baloncestoId = sports.find(s => s.name === 'Baloncesto')?.id || 2;

    await connection.beginTransaction();
    console.log('📦 Transacción iniciada\n');

    const demoLeagues = [
      {
        name: 'Liga Premier de Fútbol',
        sport_id: futbolId,
        description: 'Competición profesional de fútbol 11 con los mejores equipos de la región'
      },
      {
        name: 'Torneo Metropolitano de Baloncesto',
        sport_id: baloncestoId,
        description: 'Campeonato urbano de baloncesto con equipos locales'
      },
      {
        name: 'Copa Regional de Fútbol',
        sport_id: futbolId,
        description: 'Copa eliminatoria con equipos de toda la región'
      }
    ];

    console.log('🏆 Creando ligas demo...\n');

    for (const league of demoLeagues) {
      // Verificar si ya existe
      const [existing] = await connection.execute(
        'SELECT id, name FROM leagues WHERE name = ?',
        [league.name]
      );

      if (existing.length > 0) {
        console.log(`"${league.name}" ya existe (ID: ${existing[0].id})`);
        continue;
      }

      // Insertar liga
      const [result] = await connection.execute(
        `INSERT INTO leagues (name, sport_id, description, organizer_id, location, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [league.name, league.sport_id, league.description, organizerId, 'Honduras']
      );

      console.log(`"${league.name}" creada (ID: ${result.insertId})`);
    }

    await connection.commit();
    console.log('\nTransacción completada exitosamente\n');

    // Mostrar resumen final
    const [leagues] = await connection.execute(
      `SELECT l.id, l.name, s.name as sport, l.status
       FROM leagues l
       INNER JOIN sports s ON l.sport_id = s.id
       ORDER BY l.id`
    );

    console.log('📊 Ligas en la base de datos:');
    leagues.forEach(league => {
      console.log(`   - [${league.sport}] ${league.name} (${league.status})`);
    });

  } catch (error) {
    console.error('Error durante el seeding:', error.message);
    if (connection) {
      await connection.rollback();
      console.log('🔄 Transacción revertida');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexión cerrada');
    }
  }
}

seedDemoLeagues();
