const { body } = require('express-validator');

// Validación para crear partido
const matchSchema = [
  body('tournament_id')
    .notEmpty()
    .withMessage('El ID del torneo es requerido')
    .isInt()
    .withMessage('El ID del torneo debe ser un número entero'),
  
  body('home_team_id')
    .notEmpty()
    .withMessage('El ID del equipo local es requerido')
    .isInt()
    .withMessage('El ID del equipo local debe ser un número entero'),
  
  body('away_team_id')
    .notEmpty()
    .withMessage('El ID del equipo visitante es requerido')
    .isInt()
    .withMessage('El ID del equipo visitante debe ser un número entero')
    .custom((value, { req }) => {
      if (value === req.body.home_team_id) {
        throw new Error('El equipo local y visitante no pueden ser el mismo');
      }
      return true;
    }),
  
  body('match_date')
    .notEmpty()
    .withMessage('La fecha del partido es requerida')
    .isISO8601()
    .withMessage('La fecha debe estar en formato ISO 8601 (YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss)'),
  
  body('location')
    .optional()
    .isString()
    .withMessage('La ubicación debe ser una cadena de texto'),
  
  body('round')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La jornada debe ser un número entero mayor a 0'),
  
  body('referee')
    .optional()
    .isString()
    .withMessage('El árbitro debe ser una cadena de texto')
];

// Validación para actualizar marcador
const scoreSchema = [
  body('home_score')
    .notEmpty()
    .withMessage('El marcador del equipo local es requerido')
    .isInt({ min: 0 })
    .withMessage('El marcador del equipo local debe ser un número entero mayor o igual a 0'),
  
  body('away_score')
    .notEmpty()
    .withMessage('El marcador del equipo visitante es requerido')
    .isInt({ min: 0 })
    .withMessage('El marcador del equipo visitante debe ser un número entero mayor o igual a 0')
];

module.exports = {
  matchSchema,
  scoreSchema
};
