const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'deportes_db',
  port: process.env.MYSQL_PORT || 3306
};

const demoUsers = [
  {
    email: 'admin@proleague.com',
    password: 'Admin123!',
    name: 'Administrador Sistema',
    role: 'admin',
    phone: '+504 9999-9999'
  },
  {
    email: 'org@proleague.com',
    password: 'Org123!',
    name: 'Juan Pérez',
    role: 'organizer',
    phone: '+504 9876-5432'
  },
  {
    email: 'user@proleague.com',
    password: 'User123!',
    name: 'María García',
    role: 'user',
    phone: '+504 8765-4321'
  }
];

async function seedDemoUsers() {
  let connection;
  
  try {
    console.log('🔌 Conectando a la base de datos...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conexión establecida\n');

    await connection.beginTransaction();
    console.log('📦 Transacción iniciada\n');

    console.log('👥 Creando usuarios demo...\n');

    for (const user of demoUsers) {
      // Verificar si el usuario ya existe
      const [existing] = await connection.execute(
        'SELECT id, email FROM users WHERE email = ?',
        [user.email]
      );

      if (existing.length > 0) {
        console.log(`⏭️  ${user.email} ya existe (ID: ${existing[0].id})`);
        continue;
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Insertar usuario
      const [result] = await connection.execute(
        `INSERT INTO users (email, password, name, role, phone, created_at) 
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [user.email, hashedPassword, user.name, user.role, user.phone]
      );

      console.log(`✅ ${user.email} creado (ID: ${result.insertId}, role: ${user.role})`);
      console.log(`   Contraseña: ${user.password}`);
    }

    await connection.commit();
    console.log('\n✅ Transacción completada exitosamente\n');

    // Mostrar resumen
    const [users] = await connection.execute(
      'SELECT id, email, name, role FROM users ORDER BY role DESC, id ASC'
    );
    
    console.log('📊 Usuarios en la base de datos:');
    users.forEach(user => {
      console.log(`   - [${user.role.toUpperCase()}] ${user.email} (${user.name})`);
    });

    console.log('\n🔑 Credenciales de acceso:');
    demoUsers.forEach(user => {
      console.log(`   ${user.email} / ${user.password}`);
    });

  } catch (error) {
    console.error('❌ Error durante el seeding:', error.message);
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

seedDemoUsers();
