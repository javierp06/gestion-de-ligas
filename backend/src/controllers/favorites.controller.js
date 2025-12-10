const { getPool } = require('../config/mysql');

// Add to favorites
const addFavorite = async (req, res) => {
    try {
        const pool = getPool();
        const userId = req.user.id; // From authMiddleware
        const { entityType, entityId } = req.body;

        console.log('Attempting to add favorite:', { userId, entityType, entityId });

        if (!['league', 'team', 'tournament'].includes(entityType)) {
            return res.status(400).json({ success: false, message: 'Invalid entity type' });
        }

        // Using simple INSERT to catch potential FK errors
        // Check if exists first to avoid dup errors if we remove IGNORE
        const [existing] = await pool.query(
            'SELECT id FROM favorites WHERE user_id = ? AND entity_type = ? AND entity_id = ?',
            [userId, entityType, entityId]
        );

        if (existing.length > 0) {
            console.log('Favorite already exists');
            return res.json({ success: true, message: 'Already in favorites' });
        }

        const [result] = await pool.query(
            `INSERT INTO favorites (user_id, entity_type, entity_id) VALUES (?, ?, ?)`,
            [userId, entityType, entityId]
        );

        console.log('Favorite added, result:', result);

        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'Added to favorites' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to insert favorite' });
        }

    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ success: false, message: 'Error adding favorite: ' + error.message });
    }
};

// Remove from favorites
const removeFavorite = async (req, res) => {
    try {
        const pool = getPool();
        const userId = req.user.id;
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
        const userId = req.user.id; // Corrected ID extraction

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
