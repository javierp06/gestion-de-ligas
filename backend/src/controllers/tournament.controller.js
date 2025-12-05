const { getPool } = require('../config/mysql');
const { logActivity } = require('../utils/activityLogger');
const { upgradeUserToOrganizerIfNeeded } = require('../utils/roleHelper');

// Obtener todos los torneos
const getTournaments = async (req, res) => {
  try {
    const pool = getPool();
    const { league_id, status } = req.query;

    let query = `
      SELECT t.*, 
             l.name as league_name, 
             l.organizer_id as league_organizer_id,
             s.name as sport_name,
             u.name as organizer_name
      FROM tournaments t
      LEFT JOIN leagues l ON t.league_id = l.id
      LEFT JOIN sports s ON l.sport_id = s.id
      LEFT JOIN users u ON l.organizer_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (league_id) {
      query += ' AND t.league_id = ?';
      params.push(league_id);
    }

    if (status) {
      query += ' AND t.status = ?';
      params.push(status);
    }

    query += ' ORDER BY t.created_at DESC';

    const [tournaments] = await pool.query(query, params);

    res.json({
      success: true,
      data: tournaments
    });
  } catch (error) {
    console.error('Error obteniendo torneos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener torneos'
    });
  }
};

// Obtener torneo por ID
const getTournamentById = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;

    const [tournaments] = await pool.query(`
      SELECT t.*, 
             l.name as league_name,
             l.organizer_id as league_organizer_id,
             s.name as sport_name,
             s.description as sport_description,
             u.name as organizer_name,
             u.email as organizer_email,
             (SELECT COUNT(*) FROM players p 
              INNER JOIN teams tm ON p.team_id = tm.id 
              WHERE tm.id IN (
                SELECT DISTINCT team_id FROM matches WHERE tournament_id = t.id
              )) as teams_count
      FROM tournaments t
      LEFT JOIN leagues l ON t.league_id = l.id
      LEFT JOIN sports s ON l.sport_id = s.id
      LEFT JOIN users u ON l.organizer_id = u.id
      WHERE t.id = ?
    `, [id]);

    if (tournaments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Torneo no encontrado'
      });
    }

    res.json({
      success: true,
      data: tournaments[0]
    });
  } catch (error) {
    console.error('Error obteniendo torneo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener torneo'
    });
  }
};

// Crear nuevo torneo
const createTournament = async (req, res) => {
  try {
    const { name, description, league_id, start_date, end_date, format, max_teams, settings, cover_photo, primary_color, secondary_color } = req.body;
    const pool = getPool();

    // Verificar que la liga exista
    const [leagues] = await pool.query('SELECT id, organizer_id FROM leagues WHERE id = ?', [league_id]);

    if (leagues.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'La liga seleccionada no existe'
      });
    }

    // Validar que start_date < end_date si end_date está presente
    if (end_date && new Date(start_date) >= new Date(end_date)) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de inicio debe ser anterior a la fecha de fin'
      });
    }

    // 🎯 Upgrade automático a organizer si es user
    const wasPromoted = await upgradeUserToOrganizerIfNeeded(req.user);

    const [result] = await pool.query(
      `INSERT INTO tournaments 
       (name, description, league_id, start_date, end_date, format, max_teams, status, settings, cover_photo, primary_color, secondary_color) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, league_id, start_date, end_date || null, format || 'league', max_teams || null, 'upcoming', settings ? JSON.stringify(settings) : null, cover_photo || null, primary_color || null, secondary_color || null]
    );

    await logActivity({
      userId: req.user.id,
      userName: req.user.name || 'Usuario',
      action: 'create',
      resource: 'tournament',
      resourceId: result.insertId,
      details: {
        name,
        league_id,
        format,
        promoted_to_organizer: wasPromoted,
        is_first_tournament: wasPromoted
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(201).json({
      success: true,
      message: wasPromoted
        ? '¡Felicidades! Creaste tu primer torneo y ahora eres un Organizador. Para actualizar tu sesión, por favor vuelve a iniciar sesión.'
        : 'Torneo creado exitosamente',
      data: {
        id: result.insertId,
        name,
        description,
        league_id,
        start_date,
        end_date,
        format: format || 'league',
        max_teams,
        status: 'upcoming',
        user_was_promoted: wasPromoted
      }
    });
  } catch (error) {
    console.error('Error creando torneo:', error);

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        success: false,
        message: 'La liga seleccionada no existe',
        error: 'LEAGUE_NOT_FOUND'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al crear torneo'
    });
  }
};

// Actualizar torneo
const updateTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, start_date, end_date, format, status, max_teams, settings, cover_photo, primary_color, secondary_color } = req.body;
    const pool = getPool();

    // Verificar que el torneo exista y obtener el organizador de la liga padre
    const [tournaments] = await pool.query(`
      SELECT t.*, l.organizer_id 
      FROM tournaments t
      INNER JOIN leagues l ON t.league_id = l.id
      WHERE t.id = ?
    `, [id]);

    if (tournaments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Torneo no encontrado'
      });
    }

    // Verificar ownership: solo el organizador de la liga padre o admin pueden modificar
    if (tournaments[0].organizer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para actualizar este torneo. Solo el organizador de la liga o un administrador pueden hacerlo.'
      });
    }

    // Validar fechas si se proporcionan
    if (start_date && end_date && new Date(start_date) >= new Date(end_date)) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de inicio debe ser anterior a la fecha de fin'
      });
    }

    await pool.query(
      `UPDATE tournaments 
       SET name = ?, description = ?, start_date = ?, end_date = ?, format = ?, status = ?, max_teams = ?, settings = ?, cover_photo = ?, primary_color = ?, secondary_color = ?
       WHERE id = ?`,
      [name, description, start_date, end_date, format, status, max_teams, settings ? JSON.stringify(settings) : null, cover_photo, primary_color, secondary_color, id]
    );

    await logActivity({
      userId: req.user.id,
      userName: req.user.name || 'Usuario',
      action: 'update',
      resource: 'tournament',
      resourceId: parseInt(id),
      details: { name, status, format },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Torneo actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando torneo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar torneo'
    });
  }
};

// Eliminar torneo
const deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    // Verificar que el torneo exista y obtener el organizador de la liga padre
    const [tournaments] = await pool.query(`
      SELECT t.*, l.organizer_id 
      FROM tournaments t
      INNER JOIN leagues l ON t.league_id = l.id
      WHERE t.id = ?
    `, [id]);

    if (tournaments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Torneo no encontrado'
      });
    }

    // Verificar ownership: solo el organizador de la liga padre o admin pueden eliminar
    if (tournaments[0].organizer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar este torneo. Solo el organizador de la liga o un administrador pueden hacerlo.'
      });
    }

    await pool.query('DELETE FROM tournaments WHERE id = ?', [id]);

    await logActivity({
      userId: req.user.id,
      userName: req.user.name || 'Usuario',
      action: 'delete',
      resource: 'tournament',
      resourceId: parseInt(id),
      details: { name: tournaments[0].name },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Torneo eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando torneo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar torneo'
    });
  }
};

module.exports = {
  getTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament
};
