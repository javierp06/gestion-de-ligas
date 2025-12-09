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
        at.name as away_team_name,
        at.logo as away_team_logo
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
    const { tournament_id, start_date, interval_days = 7, total_rounds = 1 } = req.body;
    const pool = getPool();

    // 1. Validar torneo y permisos
    const [tournaments] = await pool.query('SELECT * FROM tournaments WHERE id = ?', [tournament_id]);
    if (tournaments.length === 0) {
      return res.status(404).json({ success: false, message: 'Torneo no encontrado' });
    }

    const leagueId = tournaments[0].league_id;
    const tournament = tournaments[0];
    const settings = typeof tournament.settings === 'string'
      ? JSON.parse(tournament.settings)
      : (tournament.settings || {});

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

    // Determine total rounds from settings (source of truth) or fallback to body
    let numRounds = settings.matches_per_pair ? parseInt(settings.matches_per_pair) : (parseInt(total_rounds) || 1);

    // 3. Algoritmo Round Robin
    let roundRobinTeams = [...teams];
    if (roundRobinTeams.length % 2 !== 0) {
      roundRobinTeams.push(null); // Bye
    }

    const numTeams = roundRobinTeams.length;
    const numDays = numTeams - 1; // Rounds per single leg
    const half = numTeams / 2;
    const matches = [];

    let currentDate = new Date(start_date);

    // Iterar por el número total de vueltas calculadas
    for (let leg = 0; leg < numRounds; leg++) {
      // Definir si es ida (local-visitante normal) o vuelta (invertido)
      const isReturnLeg = leg % 2 !== 0;

      for (let i = 0; i < numDays; i++) {
        // Calcular fecha correcta: Fecha inicio + ( (RondasPorVuelta * VueltaActual + RondaActual) * Intevalo )
        const roundIndex = (leg * numDays) + i;
        const matchDate = new Date(start_date);
        matchDate.setDate(matchDate.getDate() + (roundIndex * parseInt(interval_days)));

        for (let j = 0; j < half; j++) {
          const t1 = roundRobinTeams[j];
          const t2 = roundRobinTeams[numTeams - 1 - j];

          if (t1 && t2) {
            matches.push({
              tournament_id,
              home_team_id: isReturnLeg ? t2.id : t1.id,
              away_team_id: isReturnLeg ? t1.id : t2.id,
              match_date: matchDate,
              round: roundIndex + 1,
              status: 'scheduled',
              stage: 'regular_season'
            });
          }
        }

        // Rotar equipos (mantener el primero fijo)
        roundRobinTeams.splice(1, 0, roundRobinTeams.pop());
      }
    }

    // 4. Insertar en BD
    let insertedCount = 0;
    for (const match of matches) {
      await pool.query(
        `INSERT INTO matches (tournament_id, home_team_id, away_team_id, match_date, round, status, stage)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [match.tournament_id, match.home_team_id, match.away_team_id, match.match_date, match.round, match.status, match.stage]
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

// Generar Playoffs
const generatePlayoffs = async (req, res) => {
  try {
    const { tournament_id, start_date, interval_days = 3 } = req.body;
    const pool = getPool();

    // 1. Obtener info del torneo y settings
    const [tournaments] = await pool.query('SELECT * FROM tournaments WHERE id = ?', [tournament_id]);
    if (tournaments.length === 0) {
      return res.status(404).json({ success: false, message: 'Torneo no encontrado' });
    }

    const tournament = tournaments[0];
    const settings = typeof tournament.settings === 'string'
      ? JSON.parse(tournament.settings)
      : tournament.settings;

    if (!settings || !settings.has_playoff) {
      return res.status(400).json({ success: false, message: 'Este torneo no tiene playoffs configurados' });
    }

    // Verificar ownership
    const [leagues] = await pool.query('SELECT organizer_id FROM leagues WHERE id = ?', [tournament.league_id]);
    if (leagues.length === 0 || (leagues[0].organizer_id !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({ success: false, message: 'No tienes permisos para generar playoffs' });
    }

    // 2. Obtener Standings ordenados
    const [standings] = await pool.query(`
      SELECT team_id, position 
      FROM standings 
      WHERE tournament_id = ? 
      ORDER BY position ASC
    `, [tournament_id]);

    const numQualifiers = parseInt(settings.playoff_teams || 4);

    if (standings.length < numQualifiers) {
      return res.status(400).json({
        success: false,
        message: `No hay suficientes equipos clasificados. Se necesitan al menos ${numQualifiers}, hay ${standings.length}.`
      });
    }

    // 3. Generar Llaves
    const qualifiers = standings.slice(0, numQualifiers);
    const matches = [];
    const date = new Date(start_date || new Date());

    // Determinar la ronda actual para no solapar IDs de ronda
    const [lastMatch] = await pool.query('SELECT MAX(round) as max_round FROM matches WHERE tournament_id = ?', [tournament_id]);
    let currentRound = (lastMatch[0].max_round || 0) + 1;

    let stageName = '';

    if (numQualifiers === 6) {
      // REPECHAJE: 1 y 2 descansan. Juegan 3vs6 y 4vs5.
      stageName = 'quarter_final';
      const repechajeTeams = standings.slice(2, 6); // Indices 2, 3, 4, 5

      const pairings = [
        { high: repechajeTeams[0], low: repechajeTeams[3] }, // 3rd vs 6th
        { high: repechajeTeams[1], low: repechajeTeams[2] }  // 4th vs 5th
      ];

      // Get number of legs from settings
      let numLegs = 1;
      if (settings.playoff_legs === 'double') numLegs = 2;
      else if (settings.playoff_legs === 'single') numLegs = 1;
      else numLegs = parseInt(settings.playoff_legs || 1);

      for (const pair of pairings) {
        for (let leg = 0; leg < numLegs; leg++) {
          let homeTeamId, awayTeamId;

          if (numLegs === 1) {
            homeTeamId = pair.high.team_id;
            awayTeamId = pair.low.team_id;
          } else {
            if (leg % 2 === 0) {
              homeTeamId = pair.low.team_id;
              awayTeamId = pair.high.team_id;
            } else {
              homeTeamId = pair.high.team_id;
              awayTeamId = pair.low.team_id;
            }
          }

          const matchDate = new Date(date);
          if (leg > 0) {
            matchDate.setDate(matchDate.getDate() + (leg * parseInt(interval_days)));
          }

          matches.push({
            home_team_id: homeTeamId,
            away_team_id: awayTeamId,
            match_date: matchDate,
            round: currentRound + leg,
            stage: stageName,
            status: 'scheduled'
          });
        }
      }
    } else {
      if (numQualifiers === 8) stageName = 'quarter_final';
      else if (numQualifiers === 4) stageName = 'semi_final';
      else if (numQualifiers === 2) stageName = 'final';
      else stageName = 'quarter_final'; // Default fallback

      // Lógica básica 1 vs N, 2 vs N-1
      const half = numQualifiers / 2;
      // Get number of legs from settings (default to 1, maps 'double' to 2 if legacy string)
      let numLegs = 1;
      if (settings.playoff_legs === 'double') numLegs = 2;
      else if (settings.playoff_legs === 'single') numLegs = 1;
      else numLegs = parseInt(settings.playoff_legs || 1);

      for (let i = 0; i < half; i++) {
        const highSeed = qualifiers[i]; // 1st, 2nd...
        const lowSeed = qualifiers[numQualifiers - 1 - i]; // 8th, 7th...

        for (let leg = 0; leg < numLegs; leg++) {
          // Logic: Low seed is home in first leg(s) (unless single leg match, then usually high seed or neutral)
          // Common rule: In 2-leg, Leg 1 is at Low Seed. Leg 2 is at High Seed.
          // If manual N legs, we alternate.
          // Leg 0 (Odd): Low vs High
          // Leg 1 (Even): High vs Low
          // Leg 2 (Odd): Low vs High

          let homeTeamId, awayTeamId;

          if (numLegs === 1) {
            // Single match: High seed home advantage
            homeTeamId = highSeed.team_id;
            awayTeamId = lowSeed.team_id;
          } else {
            if (leg % 2 === 0) {
              // Even index (1st leg, 3rd leg) -> Low seed home
              homeTeamId = lowSeed.team_id;
              awayTeamId = highSeed.team_id;
            } else {
              // Odd index ((2nd leg, 4th leg) -> High seed home
              homeTeamId = highSeed.team_id;
              awayTeamId = lowSeed.team_id;
            }
          }

          const matchDate = new Date(date);
          if (leg > 0) {
            matchDate.setDate(matchDate.getDate() + (leg * parseInt(interval_days)));
          }

          matches.push({
            home_team_id: homeTeamId,
            away_team_id: awayTeamId,
            match_date: matchDate,
            round: currentRound + leg,
            stage: stageName,
            status: 'scheduled'
          });
        }
      }
    }

    // 4. Insertar
    let insertedCount = 0;
    for (const match of matches) {
      await pool.query(
        `INSERT INTO matches (tournament_id, home_team_id, away_team_id, match_date, round, status, stage)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [tournament_id, match.home_team_id, match.away_team_id, match.match_date, match.round, match.status, match.stage]
      );
      insertedCount++;
    }

    // Actualizar estado del torneo a in_progress si no lo estaba
    await pool.query('UPDATE tournaments SET status = "in_progress" WHERE id = ?', [tournament_id]);

    res.status(201).json({
      success: true,
      message: 'Playoffs generados exitosamente',
      data: { matches_count: insertedCount }
    });

  } catch (error) {
    console.error('Error generando playoffs:', error);
    res.status(500).json({ success: false, message: 'Error al generar playoffs' });
  }
};

// Actualizar estadísticas de jugadores
const updatePlayerStats = async (req, res) => {
  try {
    const { id } = req.params;
    const { stats } = req.body; // Array of { player_id, goals, assists, yellow_cards, red_cards, minutes_played, mvp }
    const pool = getPool();

    // 1. Verificar match y permisos
    const [matches] = await pool.query('SELECT * FROM matches WHERE id = ?', [id]);
    if (matches.length === 0) {
      return res.status(404).json({ success: false, message: 'Partido no encontrado' });
    }

    const [ownership] = await pool.query(`
      SELECT l.organizer_id, m.tournament_id
      FROM leagues l
      INNER JOIN tournaments t ON l.id = t.league_id
      INNER JOIN matches m ON t.id = m.tournament_id
      WHERE m.id = ?
    `, [id]);

    if (ownership.length === 0 || (ownership[0].organizer_id !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({ success: false, message: 'No tienes permisos para actualizar estadísticas' });
    }

    const tournamentId = ownership[0].tournament_id;

    // 2. Transaction for atomic update
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Borrar estadísticas previas para este partido
      await connection.query('DELETE FROM player_match_stats WHERE match_id = ?', [id]);

      // Insertar nuevas estadísticas
      if (stats && stats.length > 0) {
        const values = stats.map(s => [
          id,
          s.player_id,
          s.goals || 0,
          s.assists || 0,
          s.yellow_cards || 0,
          s.red_cards || 0,
          s.minutes_played || 0,
          s.mvp || false
        ]);

        await connection.query(
          `INSERT INTO player_match_stats 
           (match_id, player_id, goals, assists, yellow_cards, red_cards, minutes_played, mvp) 
           VALUES ?`,
          [values]
        );
      }

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }

    await logActivity({
      userId: req.user.id,
      userName: req.user.name || 'Usuario',
      action: 'update_stats',
      resource: 'match',
      resourceId: parseInt(id),
      details: { stats_count: stats ? stats.length : 0 },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Estadísticas de jugadores actualizadas exitosamente'
    });

  } catch (error) {
    console.error('Error actualizando estadísticas:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar estadísticas' });
  }
};

module.exports = {
  createMatch,
  getMatches,
  getMatchById,
  updateMatch,
  updateMatchScore,
  deleteMatch,
  generateFixture,
  generatePlayoffs,
  updatePlayerStats
};
