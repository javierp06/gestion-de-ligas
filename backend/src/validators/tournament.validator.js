const Joi = require('joi');

/**
 * Esquema de validación para crear/actualizar torneos
 */
const tournamentSchema = Joi.object({
  name: Joi.string().required().min(3).max(100).messages({
    'string.base': 'El nombre debe ser texto',
    'string.empty': 'El nombre es requerido',
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'string.max': 'El nombre no puede exceder 100 caracteres',
    'any.required': 'El nombre es requerido'
  }),

  description: Joi.string().allow('', null).max(500).messages({
    'string.base': 'La descripción debe ser texto',
    'string.max': 'La descripción no puede exceder 500 caracteres'
  }),

  league_id: Joi.number().integer().required().positive().messages({
    'number.base': 'El ID de la liga debe ser un número',
    'number.integer': 'El ID de la liga debe ser un número entero',
    'number.positive': 'El ID de la liga debe ser positivo',
    'any.required': 'El ID de la liga es requerido'
  }),

  start_date: Joi.date().required().messages({
    'date.base': 'La fecha de inicio debe ser una fecha válida',
    'any.required': 'La fecha de inicio es requerida'
  }),

  end_date: Joi.date().allow(null).min(Joi.ref('start_date')).messages({
    'date.base': 'La fecha de fin debe ser una fecha válida',
    'date.min': 'La fecha de fin debe ser posterior a la fecha de inicio'
  }),

  format: Joi.string().valid('league', 'knockout', 'group_knockout').default('league').messages({
    'string.base': 'El formato debe ser texto',
    'any.only': 'El formato debe ser league, knockout o group_knockout'
  }),

  status: Joi.string().valid('upcoming', 'in_progress', 'finished').default('upcoming').messages({
    'string.base': 'El estado debe ser texto',
    'any.only': 'El estado debe ser upcoming, in_progress o finished'
  }),

  max_teams: Joi.number().integer().allow(null).min(2).messages({
    'number.base': 'El número máximo de equipos debe ser un número',
    'number.integer': 'El número máximo de equipos debe ser un número entero',
    'number.min': 'El número máximo de equipos debe ser al menos 2'
  })
});

/**
 * Esquema simplificado para actualizar torneos (todos los campos opcionales excepto ID)
 */
const updateTournamentSchema = Joi.object({
  name: Joi.string().min(3).max(100).messages({
    'string.base': 'El nombre debe ser texto',
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'string.max': 'El nombre no puede exceder 100 caracteres'
  }),

  description: Joi.string().allow('', null).max(500).messages({
    'string.base': 'La descripción debe ser texto',
    'string.max': 'La descripción no puede exceder 500 caracteres'
  }),

  start_date: Joi.date().messages({
    'date.base': 'La fecha de inicio debe ser una fecha válida'
  }),

  end_date: Joi.date().allow(null).messages({
    'date.base': 'La fecha de fin debe ser una fecha válida'
  }),

  format: Joi.string().valid('league', 'knockout', 'group_knockout').messages({
    'string.base': 'El formato debe ser texto',
    'any.only': 'El formato debe ser league, knockout o group_knockout'
  }),

  status: Joi.string().valid('upcoming', 'in_progress', 'finished').messages({
    'string.base': 'El estado debe ser texto',
    'any.only': 'El estado debe ser upcoming, in_progress o finished'
  }),

  max_teams: Joi.number().integer().allow(null).min(2).messages({
    'number.base': 'El número máximo de equipos debe ser un número',
    'number.integer': 'El número máximo de equipos debe ser un número entero',
    'number.min': 'El número máximo de equipos debe ser al menos 2'
  })
});

module.exports = {
  tournamentSchema,
  updateTournamentSchema
};
