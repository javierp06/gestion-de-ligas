const express = require('express');
const router = express.Router();
const {
  getPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer
} = require('../controllers/player.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Rutas públicas
router.get('/', getPlayers);
router.get('/:id', getPlayerById);

// Rutas protegidas
router.post('/', authenticateToken, createPlayer);
router.put('/:id', authenticateToken, updatePlayer);
router.delete('/:id', authenticateToken, deletePlayer);

module.exports = router;
