const { getPool } = require('../config/mysql');
const { logActivity } = require('../utils/activityLogger');
const { upgradeUserToOrganizerIfNeeded } = require('../utils/roleHelper');

// Obtener todas las ligas
const getAllLeagues = async (req, res) => {
  try {
    const pool = getPool();
    const { status, sport_id } = req.query;

    let query = `
      SELECT l.*, s.name as sport_name, u.name as organizer_name
      FROM leagues l
      LEFT JOIN sports s ON l.sport_id = s.id
      LEFT JOIN users u ON l.organizer_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND l.status = ?';
      params.push(status);
    }

    if (sport_id) {
      query += ' AND l.sport_id = ?';
      params.push(sport_id);
    }

    query += ' ORDER BY l.created_at DESC';

    const [leagues] = await pool.query(query, params);

    res.json({
      success: true,
      data: leagues
    });
  } catch (error) {
    console.error('Error obteniendo ligas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ligas'
    });
  }
};

// Obtener liga por ID
const getLeagueById = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;

    const [leagues] = await pool.query(`
      SELECT l.*, s.name as sport_name, s.description as sport_description,
             u.name as organizer_name, u.email as organizer_email
      FROM leagues l
      LEFT JOIN sports s ON l.sport_id = s.id
      LEFT JOIN users u ON l.organizer_id = u.id
      WHERE l.id = ?
    `, [id]);

    if (leagues.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Liga no encontrada'
      });
    }

    res.json({
      success: true,
      data: leagues[0]
    });
  } catch (error) {
    console.error('Error obteniendo liga:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener liga'
    });
  }
};

// Crear nueva liga
const createLeague = async (req, res) => {
  try {
    const { name, description, sport_id, location, logo, cover_photo, settings, primary_color, secondary_color } = req.body;
    const pool = getPool();

    // Verificar que el deporte exista
    const [sports] = await pool.query('SELECT id FROM sports WHERE id = ?', [sport_id]);

    if (sports.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El deporte seleccionado no existe. Por favor, ejecuta POST /api/sports/seed primero.'
      });
    }

    // 🎯 Upgrade automático a organizer si es user
    const wasPromoted = await upgradeUserToOrganizerIfNeeded(req.user);

    const [result] = await pool.query(
      'INSERT INTO leagues (name, description, sport_id, organizer_id, location, logo, cover_photo, settings) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, sport_id, req.user.id, location, logo, cover_photo, JSON.stringify(settings || {})]
    );

    await logActivity({
      userId: req.user.id,
      userName: req.user.name || 'Usuario',
      action: 'create',
      resource: 'league',
      resourceId: result.insertId,
      details: {
        name,
        sport_id,
        promoted_to_organizer: wasPromoted,
        is_first_league: wasPromoted
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(201).json({
      success: true,
      message: wasPromoted
        ? '¡Felicidades! Creaste tu primera liga y ahora eres un Organizador. Para actualizar tu sesión, por favor vuelve a iniciar sesión.'
        : 'Liga creada exitosamente',
      data: {
        id: result.insertId,
        name,
        description,
        sport_id,
        location,
        organizer_id: req.user.id,
        user_was_promoted: wasPromoted,
        is_first_league: wasPromoted
      }
    });
  } catch (error) {
    console.error('Error creando liga:', error);

    // Mensaje específico para foreign key constraint
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        success: false,
        message: 'El deporte seleccionado no existe. Por favor, ejecuta POST /api/sports/seed primero para insertar los deportes.',
        error: 'SPORT_NOT_FOUND'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al crear liga'
    });
  }
};

// Actualizar liga
const updateLeague = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, location, status, logo, cover_photo, settings, primary_color, secondary_color } = req.body;
    const pool = getPool();

    // Verificar que la liga exista y el usuario sea el organizador o admin
    const [leagues] = await pool.query(
      'SELECT * FROM leagues WHERE id = ?',
      [id]
    );

    if (leagues.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Liga no encontrada'
      });
    }

    if (leagues[0].organizer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para actualizar esta liga'
      });
    }

    const currentLeague = leagues[0];
    const { deleteFile } = require('../services/appwrite.service');

    // Delete old images if they are being replaced
    if (logo && logo !== currentLeague.logo && currentLeague.logo) {
      await deleteFile(currentLeague.logo);
    }
    if (cover_photo && cover_photo !== currentLeague.cover_photo && currentLeague.cover_photo) {
      await deleteFile(currentLeague.cover_photo);
    }

    const [result] = await pool.query(
      'UPDATE leagues SET name = ?, description = ?, location = ?, status = ?, logo = ?, cover_photo = ?, settings = ? WHERE id = ?',
      [name, description, location, status, logo, cover_photo, JSON.stringify(settings || {}), id]
    );

    await logActivity({
      userId: req.user.id,
      userName: req.user.name || 'Usuario',
      action: 'update',
      resource: 'league',
      resourceId: parseInt(id),
      details: { name, status },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Liga actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando liga:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar liga'
    });
  }
};

// Eliminar liga
const deleteLeague = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    // Verificar que la liga exista y el usuario sea el organizador o admin
    const [leagues] = await pool.query(
      'SELECT * FROM leagues WHERE id = ?',
      [id]
    );

    if (leagues.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Liga no encontrada'
      });
    }

    if (leagues[0].organizer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar esta liga'
      });
    }

    await pool.query('DELETE FROM leagues WHERE id = ?', [id]);

    await logActivity({
      userId: req.user.id,
      userName: req.user.name || 'Usuario',
      action: 'delete',
      resource: 'league',
      resourceId: parseInt(id),
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Liga eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando liga:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar liga'
    });
  }
};

module.exports = {
  getAllLeagues,
  getLeagueById,
  createLeague,
  updateLeague,
  deleteLeague
};
