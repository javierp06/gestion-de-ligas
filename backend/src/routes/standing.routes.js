const express = require('express');
const router = express.Router();
const standingController = require('../controllers/standing.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');
const { validateRequest } = require('../middlewares/validator.middleware');

/**
 * @swagger
 * /api/standings:
 *   get:
 *     tags: [Standings]
 *     summary: Obtener tabla de posiciones de un torneo (público)
 *     parameters:
 *       - in: query
 *         name: tournament_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del torneo (requerido)
 *     responses:
 *       200:
 *         description: Tabla de posiciones ordenada por puntos, diferencia de goles y goles a favor
 *       400:
 *         description: Falta el parámetro tournament_id
 */
router.get('/', standingController.getStandings);

/**
 * @swagger
 * /api/standings/initialize/{tid}:
 *   post:
 *     tags: [Standings]
 *     summary: Inicializar tabla de posiciones con equipos en cero (Solo organizador o admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tid
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del torneo
 *     responses:
 *       201:
 *         description: Tabla de posiciones inicializada exitosamente
 *       400:
 *         description: La tabla ya está inicializada o no hay equipos
 *       403:
 *         description: No tienes permisos
 */
router.post('/initialize/:tid', [
  authenticateToken,
  authorizeRoles('admin', 'organizer'),
  validateRequest
], standingController.initializeStandings);

module.exports = router;
