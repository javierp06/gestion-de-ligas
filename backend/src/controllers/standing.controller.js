const { getPool } = require('../config/mysql');
const { calculateStandings } = require('../utils/standingsHelper');

// Obtener tabla de posiciones de un torneo
const getStandings = async (req, res) => {
  try {
    const pool = getPool();
    const { tournament_id } = req.query;

    // tournament_id es requerido
    if (!tournament_id) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro tournament_id es requerido'
      });
    }

    // Verificar que el torneo existe
    const [tournaments] = await pool.query('SELECT id, name FROM tournaments WHERE id = ?', [tournament_id]);

    if (tournaments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Torneo no encontrado'
      });
    }

    // Obtener standings con información de equipos
    const [standings] = await pool.query(`
      SELECT 
        s.*,
        t.name as team_name,
        t.logo as team_logo
      FROM standings s
      INNER JOIN teams t ON s.team_id = t.id
      WHERE s.tournament_id = ?
      ORDER BY s.position ASC
    `, [tournament_id]);

    res.json({
      success: true,
      data: {
        tournament: tournaments[0],
        standings: standings
      }
    });
  } catch (error) {
    console.error('Error obteniendo tabla de posiciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tabla de posiciones'
    });
  }
};

// Inicializar tabla de posiciones (crear registros en cero para todos los equipos)
const initializeStandings = async (req, res) => {
  try {
    const pool = getPool();
    const { tid } = req.params; // tournament_id

    // Verificar que el torneo existe
    const [tournaments] = await pool.query('SELECT id, league_id FROM tournaments WHERE id = ?', [tid]);

    if (tournaments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Torneo no encontrado'
      });
    }

    const leagueId = tournaments[0].league_id;

    // Verificar permisos: debe ser organizador de la liga o admin
    if (req.user.role !== 'admin') {
      const [leagues] = await pool.query('SELECT organizer_id FROM leagues WHERE id = ?', [leagueId]);

      if (leagues.length === 0 || leagues[0].organizer_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para inicializar la tabla de posiciones de este torneo'
        });
      }
    }

    // Obtener todos los equipos de la liga
    const [teams] = await pool.query('SELECT id FROM teams WHERE league_id = ?', [leagueId]);

    if (teams.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay equipos en la liga para inicializar la tabla de posiciones'
      });
    }

    // Insertar registro inicial para cada equipo si no existe
    let insertedCount = 0;
    for (const team of teams) {
      // Verificar si ya existe en la tabla
      const [exists] = await pool.query(
        'SELECT 1 FROM standings WHERE tournament_id = ? AND team_id = ?',
        [tid, team.id]
      );

      if (exists.length === 0) {
        await pool.query(
          `INSERT INTO standings 
           (tournament_id, team_id, matches_played, wins, draws, losses, 
            goals_for, goals_against, goal_difference, points, position)
           VALUES (?, ?, 0, 0, 0, 0, 0, 0, 0, 0, 0)`,
          [tid, team.id]
        );
        insertedCount++;
      }
    }

    // Recalcular posiciones después de insertar
    if (insertedCount > 0) {
      await calculateStandings(tid);
    }

    res.status(201).json({
      success: true,
      message: 'Tabla de posiciones inicializada exitosamente',
      data: {
        tournament_id: parseInt(tid),
        teams_initialized: insertedCount
      }
    });
  } catch (error) {
    console.error('Error inicializando tabla de posiciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al inicializar tabla de posiciones'
    });
  }
};

// Función interna para recalcular standings (wrapper del helper)
const updateStandings = async (tournamentId) => {
  try {
    await calculateStandings(tournamentId);
    return { success: true };
  } catch (error) {
    console.error('Error recalculando standings:', error);
    return { success: false, error };
  }
};

module.exports = {
  getStandings,
  initializeStandings,
  updateStandings
};
