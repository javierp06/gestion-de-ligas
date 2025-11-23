const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { validateRequest } = require('../middlewares/validator.middleware');

/**
 * @swagger
 * /api/teams:
 *   get:
 *     tags: [Teams]
 *     summary: Obtener todos los equipos
 *     parameters:
 *       - in: query
 *         name: league_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de equipos
 */
router.get('/', teamController.getTeams);

/**
 * @swagger
 * /api/teams/{id}:
 *   get:
 *     tags: [Teams]
 *     summary: Obtener equipo por ID con lista de jugadores
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles del equipo con jugadores
 */
router.get('/:id', teamController.getTeamById);

/**
 * @swagger
 * /api/teams:
 *   post:
 *     tags: [Teams]
 *     summary: Crear nuevo equipo (Cualquier usuario autenticado - Upgrade automático a organizer)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - league_id
 *             properties:
 *               name:
 *                 type: string
 *               short_name:
 *                 type: string
 *               logo:
 *                 type: string
 *               captain_id:
 *                 type: integer
 *               league_id:
 *                 type: integer
 *               founded_date:
 *                 type: string
 *                 format: date
 *               colors:
 *                 type: string
 *               stadium:
 *                 type: string
 *     responses:
 *       201:
 *         description: Equipo creado exitosamente. Usuario promovido a organizer si era user.
 */
router.post('/', [
  authenticateToken,
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('league_id').isInt().withMessage('El ID de la liga debe ser un número'),
  body('captain_id').optional().isInt().withMessage('El ID del capitán debe ser un número'),
  body('short_name').optional().isString().withMessage('El nombre corto debe ser texto'),
  body('colors').optional().isString().withMessage('Los colores deben ser texto'),
  body('stadium').optional().isString().withMessage('El estadio debe ser texto'),
  body('founded_date').optional().isISO8601().withMessage('La fecha de fundación debe ser válida'),
  validateRequest
], teamController.createTeam);

/**
 * @swagger
 * /api/teams/{id}:
 *   put:
 *     tags: [Teams]
 *     summary: Actualizar equipo (Solo capitán o admin)
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
 *               name:
 *                 type: string
 *               short_name:
 *                 type: string
 *               logo:
 *                 type: string
 *               captain_id:
 *                 type: integer
 *               founded_date:
 *                 type: string
 *                 format: date
 *               colors:
 *                 type: string
 *               stadium:
 *                 type: string
 *     responses:
 *       200:
 *         description: Equipo actualizado exitosamente
 */
router.put('/:id', [
  authenticateToken,
  validateRequest
], teamController.updateTeam);

/**
 * @swagger
 * /api/teams/{id}:
 *   delete:
 *     tags: [Teams]
 *     summary: Eliminar equipo (Solo capitán o admin)
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
 *         description: Equipo eliminado exitosamente
 */
router.delete('/:id', [
  authenticateToken
], teamController.deleteTeam);

module.exports = router;
