const { getPool } = require('../config/mysql');

/**
 * 🎯 Upgrade automático de user a organizer
 * Se ejecuta ÚNICAMENTE cuando el usuario crea su PRIMERA liga
 * 
 * @param {Object} user - Objeto req.user del middleware de autenticación
 * @returns {Promise<boolean>} true si fue promovido, false si ya era organizer/admin
 */
async function upgradeUserToOrganizerIfNeeded(user) {
  // Solo promover si es 'user' regular
  if (user.role !== 'user') {
    return false;
  }

  const pool = getPool();
  
  // Actualizar rol en la base de datos
  await pool.query(
    'UPDATE users SET role = ? WHERE id = ?',
    ['organizer', user.id]
  );

  // Actualizar objeto en memoria (importante para el request actual)
  user.role = 'organizer';

  console.log(`✅ Usuario ${user.email} (ID: ${user.id}) promovido a ORGANIZER al crear su primera liga`);

  return true;
}

module.exports = {
  upgradeUserToOrganizerIfNeeded
};
