const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Red de Eventos Deportivos',
      version: '1.0.0',
      description: 'API REST para gestionar ligas, torneos, equipos, partidos y estadísticas deportivas',
      contact: {
        name: 'Javier',
        email: 'soporte@deportes.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      { name: 'Auth', description: 'Autenticación y registro' },
      { name: 'Leagues', description: 'Gestión de ligas' },
      { name: 'Tournaments', description: 'Gestión de torneos' },
      { name: 'Teams', description: 'Gestión de equipos' },
      { name: 'Matches', description: 'Gestión de partidos' },
      { name: 'Players', description: 'Gestión de jugadores' },
      { name: 'Stats', description: 'Estadísticas' },
      { name: 'Sports', description: 'Deportes disponibles' }
    ]
  },
  apis: ['./src/routes/*.js', './src/models/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
