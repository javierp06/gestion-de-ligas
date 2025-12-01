const { getPool } = require('../config/mysql');

// Obtener tabla de goleadores
const getTopScorers = async (req, res) => {
    try {
        const { league_id, tournament_id, limit = 10 } = req.query;
        const pool = getPool();

        let query = `
      SELECT 
        p.id, p.name, p.photo, p.position,
        t.name as team_name, t.logo as team_logo,
        SUM(pms.goals) as total_goals,
        COUNT(DISTINCT pms.match_id) as matches_played
      FROM player_match_stats pms
      JOIN players p ON pms.player_id = p.id
      JOIN teams t ON p.team_id = t.id
      JOIN matches m ON pms.match_id = m.id
      WHERE pms.goals > 0
    `;

        const params = [];

        if (league_id) {
            query += ' AND t.league_id = ?';
            params.push(league_id);
        }

        if (tournament_id) {
            query += ' AND m.tournament_id = ?';
            params.push(tournament_id);
        }

        query += `
      GROUP BY p.id
      ORDER BY total_goals DESC
      LIMIT ?
    `;
        params.push(parseInt(limit));

        const [scorers] = await pool.query(query, params);

        res.json({
            success: true,
            data: scorers
        });
    } catch (error) {
        console.error('Error obteniendo goleadores:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener goleadores'
        });
    }
};

// Obtener tabla de asistencias
const getTopAssists = async (req, res) => {
    try {
        const { league_id, tournament_id, limit = 10 } = req.query;
        const pool = getPool();

        let query = `
      SELECT 
        p.id, p.name, p.photo, p.position,
        t.name as team_name, t.logo as team_logo,
        SUM(pms.assists) as total_assists,
        COUNT(DISTINCT pms.match_id) as matches_played
      FROM player_match_stats pms
      JOIN players p ON pms.player_id = p.id
      JOIN teams t ON p.team_id = t.id
      JOIN matches m ON pms.match_id = m.id
      WHERE pms.assists > 0
    `;

        const params = [];

        if (league_id) {
            query += ' AND t.league_id = ?';
            params.push(league_id);
        }

        if (tournament_id) {
            query += ' AND m.tournament_id = ?';
            params.push(tournament_id);
        }

        query += `
      GROUP BY p.id
      ORDER BY total_assists DESC
      LIMIT ?
    `;
        params.push(parseInt(limit));

        const [assists] = await pool.query(query, params);

        res.json({
            success: true,
            data: assists
        });
    } catch (error) {
        console.error('Error obteniendo asistencias:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener asistencias'
        });
    }
};

// Obtener tabla de tarjetas
const getCards = async (req, res) => {
    try {
        const { league_id, tournament_id, limit = 10 } = req.query;
        const pool = getPool();

        let query = `
      SELECT 
        p.id, p.name, p.photo, p.position,
        t.name as team_name, t.logo as team_logo,
        SUM(pms.yellow_cards) as yellow_cards,
        SUM(pms.red_cards) as red_cards,
        COUNT(DISTINCT pms.match_id) as matches_played
      FROM player_match_stats pms
      JOIN players p ON pms.player_id = p.id
      JOIN teams t ON p.team_id = t.id
      JOIN matches m ON pms.match_id = m.id
      WHERE (pms.yellow_cards > 0 OR pms.red_cards > 0)
    `;

        const params = [];

        if (league_id) {
            query += ' AND t.league_id = ?';
            params.push(league_id);
        }

        if (tournament_id) {
            query += ' AND m.tournament_id = ?';
            params.push(tournament_id);
        }

        query += `
      GROUP BY p.id
      ORDER BY red_cards DESC, yellow_cards DESC
      LIMIT ?
    `;
        params.push(parseInt(limit));

        const [cards] = await pool.query(query, params);

        res.json({
            success: true,
            data: cards
        });
    } catch (error) {
        console.error('Error obteniendo tarjetas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener tarjetas'
        });
    }
};

module.exports = {
    getTopScorers,
    getTopAssists,
    getCards
};
