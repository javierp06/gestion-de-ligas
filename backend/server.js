require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
const path = require('path');

// Importar configuraciones de base de datos
const { connectMySQL } = require('./src/config/mysql');
const { connectMongoDB } = require('./src/config/mongodb');

// Importar rutas
const authRoutes = require('./src/routes/auth.routes');
const leagueRoutes = require('./src/routes/league.routes');
const tournamentRoutes = require('./src/routes/tournament.routes');
const teamRoutes = require('./src/routes/team.routes');
const matchRoutes = require('./src/routes/match.routes');
const standingRoutes = require('./src/routes/standing.routes');
const playerRoutes = require('./src/routes/player.routes');
const statsRoutes = require('./src/routes/stats.routes');
const sportRoutes = require('./src/routes/sport.routes');
const uploadRoutes = require('./src/routes/upload.routes');
const favoritesRoutes = require('./src/routes/favorites.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Aumentar límite de listeners para evitar warning en nodemon
process.setMaxListeners(15);

// Middlewares de seguridad y optimización
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(morgan('dev'));

// CORS
app.use(cors({
  origin: true, // Allow all origins for development/mobile testing
  credentials: true
}));

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a las bases de datos
connectMySQL();
connectMongoDB();

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'API de Red de Eventos Deportivos Locales',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/leagues', leagueRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/standings', standingRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/sports', sportRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/favorites', favoritesRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación API: http://localhost:${PORT}/api-docs`);
});

module.exports = app;
