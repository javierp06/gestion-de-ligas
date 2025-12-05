const express = require('express');
const router = express.Router();
const matchController = require('../controllers/match.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { validateRequest } = require('../middlewares/validator.middleware');
const { matchSchema, scoreSchema } = require('../validators/match.validator');

/**
 * @swagger
 * /api/matches:
 *   post:
 *     tags: [Matches]
 *     summary: Crear nuevo partido (Cualquier usuario autenticado - Upgrade automático a organizer)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tournament_id
 *               - home_team_id
 *               - away_team_id
 *               - match_date
 *             properties:
 *               tournament_id:
 *                 type: integer
 *               home_team_id:
 *                 type: integer
 *               away_team_id:
 *                 type: integer
 *               match_date:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               round:
 *                 type: integer
 *               referee:
 *                 type: string
 *     responses:
 *       201:
 *         description: Partido creado exitosamente
 */
router.post('/generate-fixture', [
  authenticateToken,
  validateRequest
], matchController.generateFixture);

router.post('/', [
  authenticateToken,
  ...matchSchema,
  validateRequest
], matchController.createMatch);


/**
 * @swagger
 * /api/matches:
 *   get:
 *     tags: [Matches]
 *     summary: Obtener todos los partidos (público)
 *     parameters:
 *       - in: query
 *         name: tournament_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID del torneo
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, live, finished, postponed, cancelled]
 *         description: Filtrar por estado del partido
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar por fecha (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de partidos con información de equipos y torneo
 */
router.get('/', matchController.getMatches);

/**
 * @swagger
 * /api/matches/{id}:
 *   get:
 *     tags: [Matches]
 *     summary: Obtener partido por ID con detalles completos (público)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles del partido incluyendo estadísticas de jugadores
 */
router.get('/:id', matchController.getMatchById);

/**
 * @swagger
 * /api/matches/{id}:
 *   put:
 *     tags: [Matches]
 *     summary: Actualizar partido (Solo organizador del torneo o admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               match_date:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [scheduled, live, finished, postponed, cancelled]
 *               round:
 *                 type: integer
 *               referee:
 *                 type: string
 *     responses:
 *       200:
 *         description: Partido actualizado exitosamente
 */
router.put('/:id', [
  authenticateToken,
  validateRequest
], matchController.updateMatch);

/**
 * @swagger
 * /api/matches/{id}/score:
 *   patch:
 *     tags: [Matches]
 *     summary: Actualizar marcador (Solo organizador o admin - Recalcula tabla automáticamente)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - home_score
 *               - away_score
 *             properties:
 *               home_score:
 *                 type: integer
 *                 minimum: 0
 *               away_score:
 *                 type: integer
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Marcador actualizado y tabla de posiciones recalculada
 */
router.patch('/:id/score', [
  authenticateToken,
  ...scoreSchema,
  validateRequest
], matchController.updateMatchScore);

/**
 * @swagger
 * /api/matches/{id}:
 *   delete:
 *     tags: [Matches]
 *     summary: Eliminar partido (Solo organizador o admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Partido eliminado exitosamente
 */
router.delete('/:id', [
  authenticateToken
], matchController.deleteMatch);

module.exports = router;
