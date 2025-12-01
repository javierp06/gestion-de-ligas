const { getPool } = require('../config/mysql');
const { logActivity } = require('../utils/activityLogger');

// Obtener todos los jugadores (con filtros)
const getPlayers = async (req, res) => {
    try {
        const pool = getPool();
        const { team_id, search } = req.query;

        let query = `
      SELECT p.*, t.name as team_name, t.logo as team_logo
      FROM players p
      LEFT JOIN teams t ON p.team_id = t.id
      WHERE 1=1
    `;
        const params = [];

        if (team_id) {
            query += ' AND p.team_id = ?';
            params.push(team_id);
        }

        if (search) {
            query += ' AND (p.name LIKE ? OR p.number LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY p.name ASC';

        const [players] = await pool.query(query, params);

        res.json({
            success: true,
            data: players
        });
    } catch (error) {
        console.error('Error obteniendo jugadores:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener jugadores'
        });
    }
};

// Obtener jugador por ID
const getPlayerById = async (req, res) => {
    try {
        const pool = getPool();
        const { id } = req.params;

        const [players] = await pool.query(`
      SELECT p.*, t.name as team_name, t.logo as team_logo,
             l.name as league_name
      FROM players p
      LEFT JOIN teams t ON p.team_id = t.id
      LEFT JOIN leagues l ON t.league_id = l.id
      WHERE p.id = ?
    `, [id]);

        if (players.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Jugador no encontrado'
            });
        }

        // Obtener estadísticas del jugador
        const [stats] = await pool.query(`
      SELECT 
        COUNT(DISTINCT m.id) as matches_played,
        SUM(pms.goals) as total_goals,
        SUM(pms.assists) as total_assists,
        SUM(pms.yellow_cards) as total_yellow_cards,
        SUM(pms.red_cards) as total_red_cards
      FROM player_match_stats pms
      INNER JOIN matches m ON pms.match_id = m.id
      WHERE pms.player_id = ?
    `, [id]);

        res.json({
            success: true,
            data: {
                ...players[0],
                stats: stats[0]
            }
        });
    } catch (error) {
        console.error('Error obteniendo jugador:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener jugador'
        });
    }
};

// Crear jugador
const createPlayer = async (req, res) => {
    try {
        const { name, team_id, number, position, birth_date, photo } = req.body;
        const pool = getPool();

        // Verificar que el equipo exista
        const [teams] = await pool.query('SELECT id, league_id FROM teams WHERE id = ?', [team_id]);

        if (teams.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Equipo no encontrado'
            });
        }

        // Verificar si ya existe un jugador con ese número en el equipo
        if (number) {
            const [existing] = await pool.query(
                'SELECT id FROM players WHERE team_id = ? AND number = ?',
                [team_id, number]
            );

            if (existing.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe un jugador con ese número en el equipo'
                });
            }
        }

        const [result] = await pool.query(
            'INSERT INTO players (name, team_id, number, position, birth_date, photo) VALUES (?, ?, ?, ?, ?, ?)',
            [name, team_id, number, position, birth_date, photo]
        );

        await logActivity({
            userId: req.user.id,
            userName: req.user.name || 'Usuario',
            action: 'create',
            resource: 'player',
            resourceId: result.insertId,
            details: { name, team_id, number },
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });

        res.status(201).json({
            success: true,
            message: 'Jugador creado exitosamente',
            data: {
                id: result.insertId,
                name,
                team_id,
                number,
                position,
                birth_date,
                photo
            }
        });
    } catch (error) {
        console.error('Error creando jugador:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear jugador'
        });
    }
};

// Actualizar jugador
const updatePlayer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, team_id, number, position, birth_date, photo } = req.body;
        const pool = getPool();

        // Verificar que el jugador exista
        const [players] = await pool.query('SELECT * FROM players WHERE id = ?', [id]);

        if (players.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Jugador no encontrado'
            });
        }

        // Si cambia de equipo, verificar que el nuevo equipo exista
        if (team_id && team_id !== players[0].team_id) {
            const [teams] = await pool.query('SELECT id FROM teams WHERE id = ?', [team_id]);
            if (teams.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Nuevo equipo no encontrado'
                });
            }
        }

        // Si cambia número o equipo, verificar duplicados
        if ((number && number !== players[0].number) || (team_id && team_id !== players[0].team_id)) {
            const targetTeamId = team_id || players[0].team_id;
            const targetNumber = number || players[0].number;

            const [existing] = await pool.query(
                'SELECT id FROM players WHERE team_id = ? AND number = ? AND id != ?',
                [targetTeamId, targetNumber, id]
            );

            if (existing.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe un jugador con ese número en el equipo'
                });
            }
        }

        await pool.query(
            'UPDATE players SET name = ?, team_id = ?, number = ?, position = ?, birth_date = ?, photo = ? WHERE id = ?',
            [name, team_id, number, position, birth_date, photo, id]
        );

        await logActivity({
            userId: req.user.id,
            userName: req.user.name || 'Usuario',
            action: 'update',
            resource: 'player',
            resourceId: parseInt(id),
            details: { name, team_id, number },
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });

        res.json({
            success: true,
            message: 'Jugador actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error actualizando jugador:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar jugador'
        });
    }
};

// Eliminar jugador
const deletePlayer = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = getPool();

        const [players] = await pool.query('SELECT * FROM players WHERE id = ?', [id]);

        if (players.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Jugador no encontrado'
            });
        }

        await pool.query('DELETE FROM players WHERE id = ?', [id]);

        await logActivity({
            userId: req.user.id,
            userName: req.user.name || 'Usuario',
            action: 'delete',
            resource: 'player',
            resourceId: parseInt(id),
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });

        res.json({
            success: true,
            message: 'Jugador eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error eliminando jugador:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar jugador'
        });
    }
};

module.exports = {
    getPlayers,
    getPlayerById,
    createPlayer,
    updatePlayer,
    deletePlayer
};
