const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const leagueController = require('../controllers/league.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');
const { validateRequest } = require('../middlewares/validator.middleware');

/**
 * @swagger
 * /api/leagues:
 *   get:
 *     tags: [Leagues]
 *     summary: Obtener todas las ligas
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, finished]
 *       - in: query
 *         name: sport_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de ligas
 */
router.get('/', leagueController.getAllLeagues);

/**
 * @swagger
 * /api/leagues/{id}:
 *   get:
 *     tags: [Leagues]
 *     summary: Obtener liga por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles de la liga
 */
router.get('/:id', leagueController.getLeagueById);

/**
 * @swagger
 * /api/leagues:
 *   post:
 *     tags: [Leagues]
 *     summary: Crear nueva liga (Cualquier usuario autenticado - Upgrade automático a organizer)
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
 *               - sport_id
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               sport_id:
 *                 type: integer
 *               location:
 *                 type: string
 *               logo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Liga creada exitosamente. Usuario promovido a organizer si era user.
 */
router.post('/', [
  authenticateToken,
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('sport_id').isInt().withMessage('El ID del deporte debe ser un número'),
  validateRequest
], leagueController.createLeague);

/**
 * @swagger
 * /api/leagues/{id}:
 *   put:
 *     tags: [Leagues]
 *     summary: Actualizar liga (Solo creador o admin)
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
 *               location:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive, finished]
 *               logo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Liga actualizada exitosamente
 */
router.put('/:id', [
  authenticateToken,
  validateRequest
], leagueController.updateLeague);

/**
 * @swagger
 * /api/leagues/{id}:
 *   delete:
 *     tags: [Leagues]
 *     summary: Eliminar liga (Solo creador o admin)
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
 *         description: Liga eliminada exitosamente
 */
router.delete('/:id', [
  authenticateToken
], leagueController.deleteLeague);

module.exports = router;
