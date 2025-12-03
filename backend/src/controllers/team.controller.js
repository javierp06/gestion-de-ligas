const { getPool } = require('../config/mysql');
const { logActivity } = require('../utils/activityLogger');
const { upgradeUserToOrganizerIfNeeded } = require('../utils/roleHelper');

// Obtener todos los equipos
const getTeams = async (req, res) => {
  try {
    const pool = getPool();
    const { league_id } = req.query;

    let query = `
      SELECT t.*, 
             l.name as league_name,
             l.organizer_id as league_organizer_id,
             s.name as sport_name,
             u.name as captain_name,
             u.email as captain_email,
             COALESCE(SUM(st.matches_played), 0) as total_played,
             COALESCE(SUM(st.wins), 0) as total_won,
             COALESCE(SUM(st.points), 0) as total_points
      FROM teams t
      LEFT JOIN leagues l ON t.league_id = l.id
      LEFT JOIN sports s ON l.sport_id = s.id
      LEFT JOIN users u ON t.captain_id = u.id
      LEFT JOIN standings st ON t.id = st.team_id
      WHERE 1=1
    `;
    const params = [];

    if (league_id) {
      query += ' AND t.league_id = ?';
      params.push(league_id);
    }

    query += ' GROUP BY t.id ORDER BY t.created_at DESC';

    const [teams] = await pool.query(query, params);

    res.json({
      success: true,
      data: teams
    });
  } catch (error) {
    console.error('Error obteniendo equipos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener equipos'
    });
  }
};

// Obtener equipo por ID
const getTeamById = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;

    // Obtener información del equipo
    const [teams] = await pool.query(`
      SELECT t.*, 
             l.name as league_name,
             l.organizer_id as league_organizer_id,
             s.name as sport_name,
             s.description as sport_description,
             u.name as captain_name,
             u.email as captain_email
      FROM teams t
      LEFT JOIN leagues l ON t.league_id = l.id
      LEFT JOIN sports s ON l.sport_id = s.id
      LEFT JOIN users u ON t.captain_id = u.id
      WHERE t.id = ?
    `, [id]);

    if (teams.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Equipo no encontrado'
      });
    }

    // Obtener lista de jugadores del equipo
    const [players] = await pool.query(`
      SELECT p.*, u.name as player_name, u.email as player_email
      FROM players p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.team_id = ?
      ORDER BY p.created_at ASC
    `, [id]);

    res.json({
      success: true,
      data: {
        ...teams[0],
        players
      }
    });
  } catch (error) {
    console.error('Error obteniendo equipo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener equipo'
    });
  }
};

// Crear nuevo equipo
const createTeam = async (req, res) => {
  try {
    const { name, short_name, logo, captain_id, league_id, founded_date, colors, stadium } = req.body;
    const pool = getPool();

    // Verificar que la liga exista
    const [leagues] = await pool.query('SELECT id, organizer_id FROM leagues WHERE id = ?', [league_id]);

    if (leagues.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'La liga seleccionada no existe'
      });
    }

    // Verificar que el capitán exista si se proporciona
    if (captain_id) {
      const [users] = await pool.query('SELECT id FROM users WHERE id = ?', [captain_id]);

      if (users.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'El capitán seleccionado no existe'
        });
      }
    }

    // 🎯 Upgrade automático a organizer si es user
    const wasPromoted = await upgradeUserToOrganizerIfNeeded(req.user);

    const [result] = await pool.query(
      `INSERT INTO teams 
       (name, short_name, logo, captain_id, league_id, founded_date, colors, stadium) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, short_name || null, logo || null, captain_id || null, league_id, founded_date || null, colors || null, stadium || null]
    );

    await logActivity({
      userId: req.user.id,
      userName: req.user.name || 'Usuario',
      action: 'create',
      resource: 'team',
      resourceId: result.insertId,
      details: {
        name,
        league_id,
        captain_id,
        promoted_to_organizer: wasPromoted,
        is_first_team: wasPromoted
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(201).json({
      success: true,
      message: wasPromoted
        ? '¡Felicidades! Creaste tu primer equipo y ahora eres un Organizador. Para actualizar tu sesión, por favor vuelve a iniciar sesión.'
        : 'Equipo creado exitosamente',
      data: {
        id: result.insertId,
        name,
        short_name,
        logo,
        captain_id,
        league_id,
        founded_date,
        colors,
        stadium,
        user_was_promoted: wasPromoted
      }
    });
  } catch (error) {
    console.error('Error creando equipo:', error);

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        success: false,
        message: 'La liga o el capitán seleccionado no existe',
        error: 'REFERENCE_NOT_FOUND'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al crear equipo'
    });
  }
};

// Actualizar equipo
const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, short_name, logo, captain_id, founded_date, colors, stadium } = req.body;
    const pool = getPool();

    // Verificar que el equipo exista
    const [teams] = await pool.query('SELECT * FROM teams WHERE id = ?', [id]);

    if (teams.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Equipo no encontrado'
      });
    }

    // Verificar ownership: solo el capitán o admin pueden modificar
    if (teams[0].captain_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para actualizar este equipo. Solo el capitán o un administrador pueden hacerlo.'
      });
    }

    // Verificar que el nuevo capitán exista si se proporciona
    if (captain_id && captain_id !== teams[0].captain_id) {
      const [users] = await pool.query('SELECT id FROM users WHERE id = ?', [captain_id]);

      if (users.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'El capitán seleccionado no existe'
        });
      }
    }

    await pool.query(
      `UPDATE teams 
       SET name = ?, short_name = ?, logo = ?, captain_id = ?, founded_date = ?, colors = ?, stadium = ?
       WHERE id = ?`,
      [name, short_name, logo, captain_id, founded_date, colors, stadium, id]
    );

    await logActivity({
      userId: req.user.id,
      userName: req.user.name || 'Usuario',
      action: 'update',
      resource: 'team',
      resourceId: parseInt(id),
      details: { name, captain_id },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Equipo actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando equipo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar equipo'
    });
  }
};

// Eliminar equipo
const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    // Verificar que el equipo exista
    const [teams] = await pool.query('SELECT * FROM teams WHERE id = ?', [id]);

    if (teams.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Equipo no encontrado'
      });
    }

    // Verificar ownership: solo el capitán o admin pueden eliminar
    if (teams[0].captain_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar este equipo. Solo el capitán o un administrador pueden hacerlo.'
      });
    }

    await pool.query('DELETE FROM teams WHERE id = ?', [id]);

    await logActivity({
      userId: req.user.id,
      userName: req.user.name || 'Usuario',
      action: 'delete',
      resource: 'team',
      resourceId: parseInt(id),
      details: { name: teams[0].name },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Equipo eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando equipo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar equipo'
    });
  }
};

module.exports = {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam
};
