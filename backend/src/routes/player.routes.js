const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Players endpoint', data: [] });
});

router.get('/:id', (req, res) => {
  res.json({ success: true, message: 'Player detail' });
});

module.exports = router;
