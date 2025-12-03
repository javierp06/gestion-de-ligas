const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'deportes_db',
  port: process.env.MYSQL_PORT || 3306
};

async function migrateRoles() {
  let connection;

  try {
    console.log('🔌 Conectando a la base de datos...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Conexión establecida\n');

    // Iniciar transacción
    await connection.beginTransaction();
    console.log('📦 Transacción iniciada');

    // Verificar roles actuales
    const [currentRoles] = await connection.execute(
      'SELECT DISTINCT role FROM users ORDER BY role'
    );
    console.log('📊 Roles actuales en la base de datos:');
    currentRoles.forEach(row => console.log(`   - ${row.role}`));
    console.log('');

    // Buscar usuarios con roles inválidos
    const [invalidUsers] = await connection.execute(
      `SELECT id, email, role FROM users 
       WHERE role NOT IN ('user', 'organizer', 'admin')`
    );

    if (invalidUsers.length === 0) {
      console.log('No se encontraron roles inválidos. Todo está correcto.');
      await connection.rollback();
      return;
    }

    console.log(`Se encontraron ${invalidUsers.length} usuarios con roles inválidos:`);
    invalidUsers.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });
    console.log('');

    // Migrar roles inválidos a 'user'
    const [result] = await connection.execute(
      `UPDATE users 
       SET role = 'user' 
       WHERE role NOT IN ('user', 'organizer', 'admin')`
    );

    console.log(`${result.affectedRows} usuarios actualizados a role='user'`);

    // Confirmar transacción
    await connection.commit();
    console.log('Transacción completada exitosamente\n');

    // Verificar resultado final
    const [finalRoles] = await connection.execute(
      'SELECT role, COUNT(*) as count FROM users GROUP BY role ORDER BY role'
    );
    console.log('📊 Distribución final de roles:');
    finalRoles.forEach(row => {
      console.log(`   - ${row.role}: ${row.count} usuarios`);
    });

  } catch (error) {
    console.error('Error durante la migración:', error.message);
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

// Ejecutar migración
migrateRoles();
