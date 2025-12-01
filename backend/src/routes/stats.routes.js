const express = require('express');
const router = express.Router();
const {
  getTopScorers,
  getTopAssists,
  getCards
} = require('../controllers/stats.controller');

/**
 * @swagger
 * /api/stats/scorers:
 *   get:
 *     tags: [Stats]
 *     summary: Obtener tabla de goleadores
 *     parameters:
 *       - in: query
 *         name: league_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: tournament_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de goleadores
 */
router.get('/scorers', getTopScorers);

/**
 * @swagger
 * /api/stats/assists:
 *   get:
 *     tags: [Stats]
 *     summary: Obtener tabla de asistencias
 *     parameters:
 *       - in: query
 *         name: league_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: tournament_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de asistencias
 */
router.get('/assists', getTopAssists);

/**
 * @swagger
 * /api/stats/cards:
 *   get:
 *     tags: [Stats]
 *     summary: Obtener tabla de tarjetas
 *     parameters:
 *       - in: query
 *         name: league_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: tournament_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de tarjetas
 */
router.get('/cards', getCards);

module.exports = router;
