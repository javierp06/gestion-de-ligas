const ActivityLog = require('../models/ActivityLog');
const mongoose = require('mongoose');

/**
 * Intenta registrar una actividad en MongoDB
 * Si MongoDB no está disponible, solo registra en consola
 * @param {Object} logData - Datos del log de actividad
 */
const logActivity = async (logData) => {
  try {
    // Verificar si MongoDB está conectado
    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB no disponible, log no registrado:', logData.action);
      return;
    }

    // Intentar crear el log con timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 2000);
    });

    const createPromise = ActivityLog.create(logData);

    await Promise.race([createPromise, timeoutPromise]);
  } catch (error) {
    // No lanzar error, solo registrar en consola
    console.log('No se pudo registrar actividad en MongoDB:', error.message);
  }
};

module.exports = { logActivity };
