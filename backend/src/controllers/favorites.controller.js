const { getPool } = require('../config/mysql');

// Add to favorites
const addFavorite = async (req, res) => {
    try {
        const pool = getPool();
        const { userId } = req.user; // From authMiddleware
        const { entityType, entityId } = req.body;

        if (!['league', 'team', 'tournament'].includes(entityType)) {
            return res.status(400).json({ success: false, message: 'Invalid entity type' });
        }

        // Insert ignore to handle duplicates gracefully
        await pool.query(
            `INSERT IGNORE INTO favorites (user_id, entity_type, entity_id) VALUES (?, ?, ?)`,
            [userId, entityType, entityId]
        );

        res.json({ success: true, message: 'Added to favorites' });
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ success: false, message: 'Error adding favorite' });
    }
};

// Remove from favorites
const removeFavorite = async (req, res) => {
    try {
        const pool = getPool();
        const { userId } = req.user;
        const { entityType, entityId } = req.body;

        await pool.query(
            `DELETE FROM favorites WHERE user_id = ? AND entity_type = ? AND entity_id = ?`,
            [userId, entityType, entityId]
        );

        res.json({ success: true, message: 'Removed from favorites' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ success: false, message: 'Error removing favorite' });
    }
};

// Get user favorites (populated with names)
const getUserFavorites = async (req, res) => {
    try {
        const pool = getPool();
        const { userId } = req.user;

        // We need to join with different tables based on entity_type.
        // This can be done with separate queries or a complex UNION. separate queries might be cleaner for now.

        // 1. Get raw favorites
        const [rows] = await pool.query(
            `SELECT entity_type, entity_id, created_at FROM favorites WHERE user_id = ?`,
            [userId]
        );

        const favorites = {
            leagues: [],
            teams: [],
            tournaments: []
        };

        if (rows.length === 0) {
            return res.json({ success: true, data: favorites });
        }

        // This is a naive implementation (N+1ish), but fine for MVP scale. 
        // Optimization: fetching by IDs using IN (...) clause per type.

        const leagueIds = rows.filter(r => r.entity_type === 'league').map(r => r.entity_id);
        const teamIds = rows.filter(r => r.entity_type === 'team').map(r => r.entity_id);
        const tournamentIds = rows.filter(r => r.entity_type === 'tournament').map(r => r.entity_id);

        if (leagueIds.length > 0) {
            const [leagues] = await pool.query(`SELECT id, name, logo, sport_id FROM leagues WHERE id IN (?)`, [leagueIds]);
            favorites.leagues = leagues;
        }

        if (teamIds.length > 0) {
            const [teams] = await pool.query(`SELECT id, name, logo, short_name FROM teams WHERE id IN (?)`, [teamIds]);
            favorites.teams = teams;
        }

        if (tournamentIds.length > 0) {
            const [tournaments] = await pool.query(`SELECT id, name, status FROM tournaments WHERE id IN (?)`, [tournamentIds]);
            favorites.tournaments = tournaments;
        }

        res.json({ success: true, data: favorites });

    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ success: false, message: 'Error fetching favorites' });
    }
};

module.exports = {
    addFavorite,
    removeFavorite,
    getUserFavorites
};
