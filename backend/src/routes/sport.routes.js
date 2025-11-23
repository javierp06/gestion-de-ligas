const express = require('express');
const router = express.Router();
const { getPool } = require('../config/mysql');

// Obtener todos los deportes
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const [sports] = await pool.query('SELECT * FROM sports ORDER BY name');
    
    res.json({
      success: true,
      data: sports
    });
  } catch (error) {
    console.error('Error obteniendo deportes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener deportes'
    });
  }
});

// Insertar deportes iniciales (ejecutar una vez)
router.post('/seed', async (req, res) => {
  try {
    const pool = getPool();
    const sports = [
      { name: 'Fútbol', description: 'Fútbol 11', players_per_team: 11, icon: '⚽' },
      { name: 'Fútbol 7', description: 'Fútbol 7 jugadores', players_per_team: 7, icon: '⚽' },
      { name: 'Baloncesto', description: 'Baloncesto 5vs5', players_per_team: 5, icon: '🏀' },
      { name: 'Tenis', description: 'Tenis individual o dobles', players_per_team: 1, icon: '🎾' },
      { name: 'Pádel', description: 'Pádel dobles', players_per_team: 2, icon: '🎾' },
      { name: 'Golf', description: 'Golf individual', players_per_team: 1, icon: '⛳' },
      { name: 'Voleibol', description: 'Voleibol 6vs6', players_per_team: 6, icon: '🏐' }
    ];

    for (const sport of sports) {
      await pool.query(
        'INSERT IGNORE INTO sports (name, description, players_per_team, icon) VALUES (?, ?, ?, ?)',
        [sport.name, sport.description, sport.players_per_team, sport.icon]
      );
    }

    res.json({
      success: true,
      message: 'Deportes insertados exitosamente'
    });
  } catch (error) {
    console.error('Error insertando deportes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al insertar deportes'
    });
  }
});

module.exports = router;
