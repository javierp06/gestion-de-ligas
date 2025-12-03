const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'deportes_db',
  port: process.env.MYSQL_PORT || 3306
};

const EXPECTED_TABLES = [
  'users', 'sports', 'leagues', 'tournaments', 'teams',
  'players', 'matches', 'player_match_stats', 'standings', 'refresh_tokens'
];

async function checkDatabaseHealth() {
  let connection;

  try {
    console.log('🏥 VERIFICACIÓN DE SALUD DE BASE DE DATOS\n');
    console.log('🔌 Conectando a la base de datos...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Conexión establecida\n');

    // 1. Verificar tablas existentes
    console.log('📋 Verificando tablas...');
    const [tables] = await connection.execute(
      `SHOW TABLES FROM ${dbConfig.database}`
    );
    const tableNames = tables.map(t => Object.values(t)[0]);

    const missingTables = EXPECTED_TABLES.filter(t => !tableNames.includes(t));
    const extraTables = tableNames.filter(t => !EXPECTED_TABLES.includes(t));

    if (missingTables.length === 0) {
      console.log(`Todas las tablas esperadas existen (${EXPECTED_TABLES.length})`);
    } else {
      console.log(`Faltan ${missingTables.length} tablas: ${missingTables.join(', ')}`);
    }

    if (extraTables.length > 0) {
      console.log(`Tablas adicionales: ${extraTables.join(', ')}`);
    }
    console.log('');

    // 2. Verificar ENUM de roles en users
    console.log('👥 Verificando roles en tabla users...');
    const [columns] = await connection.execute(
      `SHOW COLUMNS FROM users WHERE Field = 'role'`
    );

    if (columns.length > 0) {
      const roleType = columns[0].Type;
      console.log(`   Tipo: ${roleType}`);

      if (roleType.includes("'user'") && roleType.includes("'organizer'") && roleType.includes("'admin'")) {
        console.log('   ENUM correcto con 3 roles');
      } else {
        console.log('   ENUM no coincide con lo esperado');
      }
    }
    console.log('');

    // 3. Contar registros por tabla
    console.log('📊 Conteo de registros...');
    for (const table of EXPECTED_TABLES) {
      if (!tableNames.includes(table)) continue;

      const [count] = await connection.execute(`SELECT COUNT(*) as total FROM ${table}`);
      const total = count[0].total;
      const emoji = total > 0 ? 'OK' : 'VACIO';
      console.log(`   ${emoji} ${table.padEnd(20)} ${total} registros`);
    }
    console.log('');

    // 4. Verificar distribución de roles
    console.log('🔐 Distribución de roles en users...');
    const [roleStats] = await connection.execute(
      'SELECT role, COUNT(*) as count FROM users GROUP BY role ORDER BY role'
    );

    if (roleStats.length === 0) {
      console.log('   ⚪ No hay usuarios en la base de datos');
    } else {
      roleStats.forEach(stat => {
        console.log(`   - ${stat.role}: ${stat.count} usuarios`);
      });
    }
    console.log('');

    // 5. Verificar deportes
    console.log('⚽ Verificando deportes...');
    const [sportsCount] = await connection.execute('SELECT COUNT(*) as total FROM sports');
    const totalSports = sportsCount[0].total;

    if (totalSports === 0) {
      console.log('   No hay deportes registrados');
      console.log('   💡 Ejecuta: POST http://localhost:3001/api/sports/seed');
    } else {
      console.log(`   ${totalSports} deportes registrados`);
      const [sports] = await connection.execute('SELECT name FROM sports ORDER BY id');
      sports.forEach(sport => console.log(`      - ${sport.name}`));
    }
    console.log('');

    // 6. Verificar ligas
    console.log('🏆 Verificando ligas...');
    const [leaguesCount] = await connection.execute('SELECT COUNT(*) as total FROM leagues');
    const totalLeagues = leaguesCount[0].total;

    if (totalLeagues === 0) {
      console.log('   ⚪ No hay ligas registradas');
    } else {
      console.log(`   ${totalLeagues} ligas registradas`);
      const [leagues] = await connection.execute(
        'SELECT l.name, s.name as sport FROM leagues l INNER JOIN sports s ON l.sport_id = s.id'
      );
      leagues.forEach(league => console.log(`      - ${league.name} (${league.sport})`));
    }
    console.log('');

    // 7. Verificar foreign keys
    console.log('🔗 Verificando integridad referencial...');
    const checks = [
      { table: 'leagues', fk: 'sport_id', ref: 'sports' },
      { table: 'leagues', fk: 'organizer_id', ref: 'users' },
      { table: 'tournaments', fk: 'league_id', ref: 'leagues' },
      { table: 'teams', fk: 'league_id', ref: 'leagues' }
    ];

    for (const check of checks) {
      try {
        const [orphans] = await connection.execute(
          `SELECT COUNT(*) as count FROM ${check.table} 
           WHERE ${check.fk} IS NOT NULL 
           AND ${check.fk} NOT IN (SELECT id FROM ${check.ref})`
        );

        if (orphans[0].count === 0) {
          console.log(`   ${check.table}.${check.fk} -> ${check.ref}.id (integridad OK)`);
        } else {
          console.log(`   ${check.table}.${check.fk} -> ${check.ref}.id (${orphans[0].count} huérfanos)`);
        }
      } catch (err) {
        console.log(`   ${check.table}.${check.fk} -> ${check.ref}.id (no se pudo verificar)`);
      }
    }

    console.log('\nVERIFICACIÓN COMPLETADA\n');

  } catch (error) {
    console.error('Error durante la verificación:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

checkDatabaseHealth();
