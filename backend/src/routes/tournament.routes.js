const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const tournamentController = require('../controllers/tournament.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { validateRequest } = require('../middlewares/validator.middleware');

/**
 * @swagger
 * /api/tournaments:
 *   get:
 *     tags: [Tournaments]
 *     summary: Obtener todos los torneos
 *     parameters:
 *       - in: query
 *         name: league_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [upcoming, in_progress, finished]
 *     responses:
 *       200:
 *         description: Lista de torneos
 */
router.get('/', tournamentController.getTournaments);

/**
 * @swagger
 * /api/tournaments/{id}:
 *   get:
 *     tags: [Tournaments]
 *     summary: Obtener torneo por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles del torneo
 */
router.get('/:id', tournamentController.getTournamentById);

/**
 * @swagger
 * /api/tournaments:
 *   post:
 *     tags: [Tournaments]
 *     summary: Crear nuevo torneo (Cualquier usuario autenticado - Upgrade automático a organizer)
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
 *               - start_date
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               league_id:
 *                 type: integer
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               format:
 *                 type: string
 *                 enum: [league, knockout, group_knockout]
 *               max_teams:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Torneo creado exitosamente. Usuario promovido a organizer si era user.
 */
router.post('/', [
  authenticateToken,
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('league_id').isInt().withMessage('El ID de la liga debe ser un número'),
  body('start_date').notEmpty().withMessage('La fecha de inicio es requerida'),
  body('start_date').isISO8601().withMessage('La fecha de inicio debe ser válida'),
  body('end_date').optional().isISO8601().withMessage('La fecha de fin debe ser válida'),
  body('format').optional().isIn(['league', 'knockout', 'group_knockout']).withMessage('El formato debe ser league, knockout o group_knockout'),
  body('max_teams').optional().isInt({ min: 2 }).withMessage('El número máximo de equipos debe ser al menos 2'),
  validateRequest
], tournamentController.createTournament);

/**
 * @swagger
 * /api/tournaments/{id}:
 *   put:
 *     tags: [Tournaments]
 *     summary: Actualizar torneo (Solo organizador de la liga padre o admin)
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
 *               description:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               format:
 *                 type: string
 *                 enum: [league, knockout, group_knockout]
 *               status:
 *                 type: string
 *                 enum: [upcoming, in_progress, finished]
 *               max_teams:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Torneo actualizado exitosamente
 */
router.put('/:id', [
  authenticateToken,
  validateRequest
], tournamentController.updateTournament);

/**
 * @swagger
 * /api/tournaments/{id}:
 *   delete:
 *     tags: [Tournaments]
 *     summary: Eliminar torneo (Solo organizador de la liga padre o admin)
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
 *         description: Torneo eliminado exitosamente
 */
router.delete('/:id', [
  authenticateToken
], tournamentController.deleteTournament);

module.exports = router;
