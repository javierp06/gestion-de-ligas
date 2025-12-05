const { getPool } = require('../config/mysql');
const { logActivity } = require('../utils/activityLogger');
const { upgradeUserToOrganizerIfNeeded } = require('../utils/roleHelper');
const { calculateStandings } = require('../utils/standingsHelper');

// Crear nuevo partido
const createMatch = async (req, res) => {
  try {
    const { tournament_id, home_team_id, away_team_id, match_date, location, round, referee } = req.body;
    const pool = getPool();

    // Validar que home_team_id y away_team_id son diferentes
    if (home_team_id === away_team_id) {
      return res.status(400).json({
        success: false,
        message: 'El equipo local y visitante no pueden ser el mismo'
      });
    }

    // Verificar que el torneo existe
    const [tournaments] = await pool.query('SELECT id, league_id FROM tournaments WHERE id = ?', [tournament_id]);

    if (tournaments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Torneo no encontrado'
      });
    }

    const leagueId = tournaments[0].league_id;

    // Verificar que ambos equipos existen
    const [homeTeam] = await pool.query('SELECT id, league_id FROM teams WHERE id = ?', [home_team_id]);
    const [awayTeam] = await pool.query('SELECT id, league_id FROM teams WHERE id = ?', [away_team_id]);

    if (homeTeam.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Equipo local no encontrado'
      });
    }

    if (awayTeam.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Equipo visitante no encontrado'
      });
    }

    // Verificar que ambos equipos pertenecen a la misma liga del torneo
    if (homeTeam[0].league_id !== leagueId) {
      return res.status(400).json({
        success: false,
        message: 'El equipo local no pertenece a la liga del torneo'
      });
    }

    if (awayTeam[0].league_id !== leagueId) {
      return res.status(400).json({
        success: false,
        message: 'El equipo visitante no pertenece a la liga del torneo'
      });
    }

    // 🎯 Upgrade automático a organizer si es user
    const wasPromoted = await upgradeUserToOrganizerIfNeeded(req.user);

    // Crear el partido
    const [result] = await pool.query(
      `INSERT INTO matches 
       (tournament_id, home_team_id, away_team_id, match_date, location, round, referee, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'scheduled')`,
      [tournament_id, home_team_id, away_team_id, match_date, location, round, referee]
    );

    await logActivity({
      userId: req.user.id,
      userName: req.user.name || 'Usuario',
      action: 'create',
      resource: 'match',
      resourceId: result.insertId,
      details: {
        tournament_id,
        home_team_id,
        away_team_id,
        match_date,
        promoted_to_organizer: wasPromoted
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(201).json({
      success: true,
      message: wasPromoted
        ? '¡Felicidades! Creaste tu primer partido y ahora eres un Organizador. Para actualizar tu sesión, por favor vuelve a iniciar sesión.'
        : 'Partido creado exitosamente',
      data: {
        id: result.insertId,
        tournament_id,
        home_team_id,
        away_team_id,
        match_date,
        location,
        round,
        referee,
        status: 'scheduled',
        user_was_promoted: wasPromoted
      }
    });
  } catch (error) {
    console.error('Error creando partido:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear partido'
    });
  }
};

// Obtener todos los partidos con filtros
const getMatches = async (req, res) => {
  try {
    const pool = getPool();
    const { tournament_id, status, date, team_id } = req.query;

    let query = `
      SELECT 
        m.*,
        t.name as tournament_name,
        ht.name as home_team_name,
        ht.logo as home_team_logo,
        at.name as away_team_name,
        at.logo as away_team_logo,
        s.name as sport_name
      FROM matches m
      INNER JOIN tournaments t ON m.tournament_id = t.id
      INNER JOIN leagues l ON t.league_id = l.id
      INNER JOIN sports s ON l.sport_id = s.id
      INNER JOIN teams ht ON m.home_team_id = ht.id
      INNER JOIN teams at ON m.away_team_id = at.id
      WHERE 1=1
    `;
    const params = [];

    if (tournament_id) {
      query += ' AND m.tournament_id = ?';
      params.push(tournament_id);
    }

    if (team_id) {
      query += ' AND (m.home_team_id = ? OR m.away_team_id = ?)';
      params.push(team_id, team_id);
    }

    if (status) {
      query += ' AND m.status = ?';
      params.push(status);
    }

    if (date) {
      query += ' AND DATE(m.match_date) = ?';
      params.push(date);
    }

    query += ' ORDER BY m.match_date DESC';

    const [matches] = await pool.query(query, params);

    res.json({
      success: true,
      data: matches
    });
  } catch (error) {
    console.error('Error obteniendo partidos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener partidos'
    });
  }
};

// Obtener partido por ID con detalles completos
const getMatchById = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;

    const [matches] = await pool.query(`
      SELECT 
        m.*,
        t.name as tournament_name,
        t.start_date as tournament_start_date,
        t.end_date as tournament_end_date,
        l.name as league_name,
        ht.name as home_team_name,
        ht.logo as home_team_logo,
        ht.founded_year as home_team_founded,
        at.name as away_team_name,
        at.logo as away_team_logo,
        at.founded_year as away_team_founded
      FROM matches m
      INNER JOIN tournaments t ON m.tournament_id = t.id
      INNER JOIN leagues l ON t.league_id = l.id
      INNER JOIN teams ht ON m.home_team_id = ht.id
      INNER JOIN teams at ON m.away_team_id = at.id
      WHERE m.id = ?
    `, [id]);

    if (matches.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Partido no encontrado'
      });
    }

    // Obtener estadísticas de jugadores si existen
    const [stats] = await pool.query(`
      SELECT 
        pms.*,
        p.name as player_name,
        t.name as team_name
      FROM player_match_stats pms
      INNER JOIN players p ON pms.player_id = p.id
      INNER JOIN teams t ON p.team_id = t.id
      WHERE pms.match_id = ?
      ORDER BY pms.goals DESC, pms.assists DESC
    `, [id]);

    res.json({
      success: true,
      data: {
        ...matches[0],
        player_stats: stats
      }
    });
  } catch (error) {
    console.error('Error obteniendo partido:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener partido'
    });
  }
};

// Actualizar partido completo
const updateMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { match_date, location, status, round, referee } = req.body;
    const pool = getPool();

    // Verificar que el partido existe
    const [matches] = await pool.query('SELECT * FROM matches WHERE id = ?', [id]);

    if (matches.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Partido no encontrado'
      });
    }

    // Verificar ownership: el usuario debe ser el organizador de la liga o admin
    const [ownership] = await pool.query(`
      SELECT l.organizer_id
      FROM leagues l
      INNER JOIN tournaments t ON l.id = t.league_id
      INNER JOIN matches m ON t.id = m.tournament_id
      WHERE m.id = ?
    `, [id]);

    if (ownership.length === 0 || (ownership[0].organizer_id !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para actualizar este partido'
      });
    }

    await pool.query(
      `UPDATE matches 
       SET match_date = ?, location = ?, status = ?, round = ?, referee = ?
       WHERE id = ?`,
      [match_date, location, status, round, referee, id]
    );

    await logActivity({
      userId: req.user.id,
      userName: req.user.name || 'Usuario',
      action: 'update',
      resource: 'match',
      resourceId: parseInt(id),
      details: { status, match_date },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Partido actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando partido:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar partido'
    });
  }
};

// Actualizar marcador del partido (TRIGGER: recalcula standings)
const updateMatchScore = async (req, res) => {
  try {
    const { id } = req.params;
    const { home_score, away_score } = req.body;
    const pool = getPool();

    // Verificar que el partido existe
    const [matches] = await pool.query('SELECT * FROM matches WHERE id = ?', [id]);

    if (matches.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Partido no encontrado'
      });
    }

    // Verificar ownership: el usuario debe ser el organizador de la liga o admin
    const [ownership] = await pool.query(`
      SELECT l.organizer_id, m.tournament_id
      FROM leagues l
      INNER JOIN tournaments t ON l.id = t.league_id
      INNER JOIN matches m ON t.id = m.tournament_id
      WHERE m.id = ?
    `, [id]);

    if (ownership.length === 0 || (ownership[0].organizer_id !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para actualizar el marcador de este partido'
      });
    }

    const tournamentId = ownership[0].tournament_id;

    // Actualizar marcador y cambiar status a finished
    await pool.query(
      `UPDATE matches 
       SET home_score = ?, away_score = ?, status = 'finished'
       WHERE id = ?`,
      [home_score, away_score, id]
    );

    // 🎯 TRIGGER: Recalcular tabla de posiciones automáticamente
    await calculateStandings(tournamentId);

    await logActivity({
      userId: req.user.id,
      userName: req.user.name || 'Usuario',
      action: 'update_score',
      resource: 'match',
      resourceId: parseInt(id),
      details: { home_score, away_score, status: 'finished', standings_updated: true },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Marcador actualizado y tabla de posiciones recalculada exitosamente',
      data: {
        home_score,
        away_score,
        status: 'finished',
        standings_updated: true
      }
    });
  } catch (error) {
    console.error('Error actualizando marcador:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar marcador'
    });
  }
};

// Eliminar partido
const deleteMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    // Verificar que el partido existe
    const [matches] = await pool.query('SELECT * FROM matches WHERE id = ?', [id]);

    if (matches.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Partido no encontrado'
      });
    }

    // Verificar ownership: el usuario debe ser el organizador de la liga o admin
    const [ownership] = await pool.query(`
      SELECT l.organizer_id
      FROM leagues l
      INNER JOIN tournaments t ON l.id = t.league_id
      INNER JOIN matches m ON t.id = m.tournament_id
      WHERE m.id = ?
    `, [id]);

    if (ownership.length === 0 || (ownership[0].organizer_id !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar este partido'
      });
    }

    await pool.query('DELETE FROM matches WHERE id = ?', [id]);

    await logActivity({
      userId: req.user.id,
      userName: req.user.name || 'Usuario',
      action: 'delete',
      resource: 'match',
      resourceId: parseInt(id),
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Partido eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando partido:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar partido'
    });
  }
};

// Generar fixture (calendario) automático
const generateFixture = async (req, res) => {
  try {
    const { tournament_id, start_date, interval_days = 7, has_return_leg = false } = req.body;
    const pool = getPool();

    // 1. Validar torneo y permisos
    const [tournaments] = await pool.query('SELECT * FROM tournaments WHERE id = ?', [tournament_id]);
    if (tournaments.length === 0) {
      return res.status(404).json({ success: false, message: 'Torneo no encontrado' });
    }

    const leagueId = tournaments[0].league_id;

    // Verificar ownership
    const [leagues] = await pool.query('SELECT organizer_id FROM leagues WHERE id = ?', [leagueId]);
    if (leagues.length === 0 || (leagues[0].organizer_id !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({ success: false, message: 'No tienes permisos para generar el calendario' });
    }

    // 2. Obtener equipos
    const [teams] = await pool.query('SELECT id FROM teams WHERE league_id = ?', [leagueId]);
    if (teams.length < 2) {
      return res.status(400).json({ success: false, message: 'Se necesitan al menos 2 equipos para generar un calendario' });
    }

    // 3. Algoritmo Round Robin
    let roundRobinTeams = [...teams];
    if (roundRobinTeams.length % 2 !== 0) {
      roundRobinTeams.push(null); // Bye
    }

    const numRounds = roundRobinTeams.length - 1;
    const half = roundRobinTeams.length / 2;
    const matches = [];

    let currentDate = new Date(start_date);

    // Generar Ida
    for (let i = 0; i < numRounds; i++) {
      for (let j = 0; j < half; j++) {
        const home = roundRobinTeams[j];
        const away = roundRobinTeams[roundRobinTeams.length - 1 - j];

        if (home && away) {
          matches.push({
            tournament_id,
            home_team_id: home.id,
            away_team_id: away.id,
            match_date: new Date(currentDate),
            round: i + 1,
            status: 'scheduled'
          });
        }
      }

      // Rotar equipos (mantener el primero fijo)
      roundRobinTeams.splice(1, 0, roundRobinTeams.pop());

      // Avanzar fecha para la siguiente jornada
      currentDate.setDate(currentDate.getDate() + parseInt(interval_days));
    }

    // Generar Vuelta (si aplica)
    if (has_return_leg) {
      const firstLegMatches = [...matches]; // Copia de los partidos de ida

      for (const match of firstLegMatches) {
        matches.push({
          tournament_id,
          home_team_id: match.away_team_id, // Invertir localía
          away_team_id: match.home_team_id,
          match_date: new Date(currentDate), // Usar la fecha acumulada
          round: match.round + numRounds, // Ronda continua
          status: 'scheduled'
        });
      }
      // Nota: Esto pone todos los partidos de vuelta en la misma fecha base si no ajustamos la fecha por ronda.
      // Ajuste correcto para vuelta: iterar rondas de nuevo o simplemente duplicar lógica con inversión.
      // Simplificación para este MVP: La vuelta se genera como un bloque espejo, pero las fechas deberían seguir incrementando.

      // Re-generar fechas para la vuelta correctamente:
      // Resetear matches de vuelta y hacerlo ronda por ronda
      // (Omitido por brevedad, pero para un MVP simple, podríamos simplemente invertir y sumar fechas)

      // Corrección rápida para fechas de vuelta:
      // Recorrer las rondas de ida (1 a numRounds)
      // Para cada ronda i, crear la ronda i + numRounds con localía invertida
      // Fecha = fecha de ronda i + (numRounds * interval)

      // Limpiar matches de vuelta añadidos incorrectamente arriba y hacerlo bien:
      matches.splice(firstLegMatches.length); // Borrar lo añadido

      for (let i = 0; i < numRounds; i++) {
        const roundMatches = firstLegMatches.filter(m => m.round === i + 1);
        const returnRoundDate = new Date(roundMatches[0].match_date);
        returnRoundDate.setDate(returnRoundDate.getDate() + (numRounds * parseInt(interval_days)));

        for (const match of roundMatches) {
          matches.push({
            tournament_id,
            home_team_id: match.away_team_id,
            away_team_id: match.home_team_id,
            match_date: returnRoundDate,
            round: i + 1 + numRounds,
            status: 'scheduled'
          });
        }
      }
    }

    // 4. Insertar en BD
    // Usar transacción idealmente, pero por simplicidad haremos inserts masivos
    let insertedCount = 0;
    for (const match of matches) {
      await pool.query(
        `INSERT INTO matches (tournament_id, home_team_id, away_team_id, match_date, round, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [match.tournament_id, match.home_team_id, match.away_team_id, match.match_date, match.round, match.status]
      );
      insertedCount++;
    }

    res.status(201).json({
      success: true,
      message: 'Calendario generado exitosamente',
      data: {
        matches_count: insertedCount
      }
    });

  } catch (error) {
    console.error('Error generando fixture:', error);
    res.status(500).json({ success: false, message: 'Error al generar el calendario' });
  }
};

module.exports = {
  createMatch,
  getMatches,
  getMatchById,
  updateMatch,
  updateMatchScore,
  deleteMatch,
  generateFixture
};
