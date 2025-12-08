const express = require('express');
const router = express.Router();
const { addFavorite, removeFavorite, getUserFavorites } = require('../controllers/favorites.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.use(authenticateToken);

router.post('/', addFavorite);
router.delete('/', removeFavorite);
router.get('/', getUserFavorites);

module.exports = router;
