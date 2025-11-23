const Joi = require('joi');

/**
 * Esquema de validación para crear/actualizar equipos
 */
const teamSchema = Joi.object({
  name: Joi.string().required().min(3).max(100).messages({
    'string.base': 'El nombre debe ser texto',
    'string.empty': 'El nombre es requerido',
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'string.max': 'El nombre no puede exceder 100 caracteres',
    'any.required': 'El nombre es requerido'
  }),

  short_name: Joi.string().allow('', null).max(10).messages({
    'string.base': 'El nombre corto debe ser texto',
    'string.max': 'El nombre corto no puede exceder 10 caracteres'
  }),

  logo: Joi.string().allow('', null).uri().messages({
    'string.base': 'El logo debe ser texto',
    'string.uri': 'El logo debe ser una URL válida'
  }),

  captain_id: Joi.number().integer().allow(null).positive().messages({
    'number.base': 'El ID del capitán debe ser un número',
    'number.integer': 'El ID del capitán debe ser un número entero',
    'number.positive': 'El ID del capitán debe ser positivo'
  }),

  league_id: Joi.number().integer().required().positive().messages({
    'number.base': 'El ID de la liga debe ser un número',
    'number.integer': 'El ID de la liga debe ser un número entero',
    'number.positive': 'El ID de la liga debe ser positivo',
    'any.required': 'El ID de la liga es requerido'
  }),

  founded_date: Joi.date().allow(null).max('now').messages({
    'date.base': 'La fecha de fundación debe ser una fecha válida',
    'date.max': 'La fecha de fundación no puede ser futura'
  }),

  colors: Joi.string().allow('', null).max(50).messages({
    'string.base': 'Los colores deben ser texto',
    'string.max': 'Los colores no pueden exceder 50 caracteres'
  }),

  stadium: Joi.string().allow('', null).max(100).messages({
    'string.base': 'El estadio debe ser texto',
    'string.max': 'El estadio no puede exceder 100 caracteres'
  })
});

/**
 * Esquema simplificado para actualizar equipos (todos los campos opcionales excepto ID)
 */
const updateTeamSchema = Joi.object({
  name: Joi.string().min(3).max(100).messages({
    'string.base': 'El nombre debe ser texto',
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'string.max': 'El nombre no puede exceder 100 caracteres'
  }),

  short_name: Joi.string().allow('', null).max(10).messages({
    'string.base': 'El nombre corto debe ser texto',
    'string.max': 'El nombre corto no puede exceder 10 caracteres'
  }),

  logo: Joi.string().allow('', null).uri().messages({
    'string.base': 'El logo debe ser texto',
    'string.uri': 'El logo debe ser una URL válida'
  }),

  captain_id: Joi.number().integer().allow(null).positive().messages({
    'number.base': 'El ID del capitán debe ser un número',
    'number.integer': 'El ID del capitán debe ser un número entero',
    'number.positive': 'El ID del capitán debe ser positivo'
  }),

  founded_date: Joi.date().allow(null).max('now').messages({
    'date.base': 'La fecha de fundación debe ser una fecha válida',
    'date.max': 'La fecha de fundación no puede ser futura'
  }),

  colors: Joi.string().allow('', null).max(50).messages({
    'string.base': 'Los colores deben ser texto',
    'string.max': 'Los colores no pueden exceder 50 caracteres'
  }),

  stadium: Joi.string().allow('', null).max(100).messages({
    'string.base': 'El estadio debe ser texto',
    'string.max': 'El estadio no puede exceder 100 caracteres'
  })
});

module.exports = {
  teamSchema,
  updateTeamSchema
};
