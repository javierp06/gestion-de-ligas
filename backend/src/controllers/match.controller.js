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
    const { tournament_id, status, date, team_id, sport_id } = req.query;

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

    if (sport_id) {
      query += ' AND s.id = ?';
      params.push(sport_id);
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

    // Obtener plantillas completas (Rosters)
    const [homeRoster] = await pool.query('SELECT * FROM players WHERE team_id = ?', [matches[0].home_team_id]);
    const [awayRoster] = await pool.query('SELECT * FROM players WHERE team_id = ?', [matches[0].away_team_id]);

    res.json({
      success: true,
      data: {
        ...matches[0],
        player_stats: stats,
        home_roster: homeRoster,
        away_roster: awayRoster
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

    // Prepare values for update (handle partial updates)
    const currentMatch = matches[0];

    let uDate = match_date !== undefined ? match_date : currentMatch.match_date;
    const uLocation = location !== undefined ? location : currentMatch.location;
    const uStatus = status !== undefined ? status : currentMatch.status;
    const uRound = round !== undefined ? round : currentMatch.round;
    const uReferee = referee !== undefined ? referee : currentMatch.referee;

    // Fix Date format if it's a string
    if (uDate && typeof uDate === 'string') {
      uDate = new Date(uDate);
    }

    await pool.query(
      `UPDATE matches 
       SET match_date = ?, location = ?, status = ?, round = ?, referee = ?
       WHERE id = ?`,
      [uDate, uLocation, uStatus, uRound, uReferee, id]
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

    // Determine status (use provided or keep existing)
    // If not provided, don't auto-finish unless it was already finished.
    // If the user wants to finish, they should send status='finished' (which the 'Edit Result' modal might need to be updated to do, or we assume 'finished' if it comes from there? 
    // actually EditResultModal sends status in a separate call or we need to align. 
    // Let's rely on the body.status. If missing, keep current.)

    let newStatus = req.body.status;
    if (!newStatus) {
      newStatus = matches[0].status;
      // Legacy fallback: If it was 'scheduled' and we are setting a score, maybe we *should* mark as live? 
      // But let's just respect the current status.
    }

    // Actualizar marcador y status
    await pool.query(
      `UPDATE matches 
       SET home_score = ?, away_score = ?, status = ?
       WHERE id = ?`,
      [home_score, away_score, newStatus, id]
    );

    // 🏆 LOGICA DE BRACKET / KNOCKOUT
    // Solo avanzar si el partido está TERMINADO
    if (newStatus === 'finished' && matches[0].next_match_id && matches[0].next_match_slot) {
      let winnerId = null;
      if (home_score > away_score) {
        winnerId = matches[0].home_team_id;
      } else if (away_score > home_score) {
        winnerId = matches[0].away_team_id;
      }
      // TODO: Manejar empates (penales) si es necesario

      if (winnerId) {
        const updateField = matches[0].next_match_slot === 'home' ? 'home_team_id' : 'away_team_id';
        await pool.query(
          `UPDATE matches SET ${updateField} = ? WHERE id = ?`,
          [winnerId, matches[0].next_match_id]
        );
      }
    }

    // Recalcular tabla de posiciones (Live Standings supported!)
    await calculateStandings(tournamentId);

    await logActivity({
      userId: req.user.id,
      userName: req.user.name || 'Usuario',
      action: 'update',
      resource: 'match',
      resourceId: parseInt(id),
      details: { home_score, away_score, status: newStatus, standings_updated: true },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Marcador actualizado exitosamente',
      data: {
        home_score,
        away_score,
        status: newStatus,
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

    // --- LOGICA DE KNOCKOUT ---
    if (tournament.format === 'knockout') {
      // Barajar equipos aleatoriamente
      const shuffled = teams.sort(() => 0.5 - Math.random());

      // Limitar a max_teams o potencia de 2 más cercana hacia abajo
      let limit = settings.max_teams || 16; // default 16
      // Ajustar limit a la potencia de 2 que quepa en teams.length
      // O tomar teams.length si es potencia de 2, si no el siguiente power of 2 con byes (demasiado complejo para ahora, tomemos slice simples)
      const selectedTeams = shuffled.slice(0, Math.min(limit, teams.length));

      if (selectedTeams.length < 2) {
        return res.status(400).json({ success: false, message: 'No hay suficientes equipos para crear una llave.' });
      }

      // Crear enfrentamientos (Round 1)
      const matches = [];
      const matchDate = new Date(start_date);

      // Helper para crear partido
      const createMatch = async (round, stage, nextMatchId = null, nextMatchSlot = null, homeId = null, awayId = null, mDate) => {
        const [result] = await pool.query(
          `INSERT INTO matches (tournament_id, home_team_id, away_team_id, match_date, round, stage, status, next_match_id, next_match_slot)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [tournament_id, homeId, awayId, mDate, round, stage, 'scheduled', nextMatchId, nextMatchSlot]
        );
        return result.insertId;
      };

      // Si son 2, 4, 8, 16 equipos, generar el árbol
      // Simplificación: Generamos solo la Ronda 1 (Cuartos/Octavos) y los huecos para las siguientes rondas?
      // Mejor estrategia: Reutilizar lógica de árbol completo de generatePlayoffs pero con semillas aleatorias.
      // Por simplicidad en "polished", generaremos SOLO los partidos de la Ronda 1.
      // El sistema de "updateMatchScore" ya maneja "next_match_id", pero necesitamos crear los partidos vacíos futuros para que eso funcione.

      // Implementación Robusta: Recursive Tree Generation
      // 1. Determinar profundidad (log2(N))
      // 2. Crear partido Final
      // 3. Crear Semis apuntando a Final
      // 4. Crear Cuartos apuntando a Semis...
      // Esto es complejo de inline. 
      // FALLBACK SEGURO: Generar solo Ronda 1. El admin tendrá que generar la Ronda 2 manualmente o el sistema debería auto-crear al finalizar.
      // Dado que "updateMatchScore" tiene lógica de "next_match", requiere que el "next_match" YA EXISTA.
      // Así que DEBO generar el árbol completo.

      // Vamos a usar una lógica simplificada para 8, 4, 2 equipos que cubre la mayoría de casos.
      const count = selectedTeams.length;
      let insertedCount = 0;

      if (count <= 2) {
        // Final Directa
        const [t1, t2] = selectedTeams;
        await createMatch(1, 'final', null, null, t1.id, t2.id, matchDate);
        insertedCount = 1;
      } else if (count <= 4) {
        // Semis + Final
        const finalDate = new Date(matchDate); finalDate.setDate(finalDate.getDate() + 7);
        const finalId = await createMatch(2, 'final', null, null, null, null, finalDate);

        // Semis
        const [t1, t2, t3, t4] = selectedTeams;
        // Semi 1
        await createMatch(1, 'semi_final', finalId, 'home', t1.id, t2.id, matchDate);
        // Semi 2
        const t3id = t3 ? t3.id : null; // Bye handling basic
        const t4id = t4 ? t4.id : null;
        await createMatch(1, 'semi_final', finalId, 'away', t3id, t4id, matchDate);
        insertedCount = 3;
      } else if (count <= 8) {
        // Cuartos + Semis + Final
        const finalDate = new Date(matchDate); finalDate.setDate(finalDate.getDate() + 14);
        const zeroDate = new Date(matchDate); zeroDate.setDate(zeroDate.getDate() + 7); // Semis

        const finalId = await createMatch(3, 'final', null, null, null, null, finalDate);
        const s1 = await createMatch(2, 'semi_final', finalId, 'home', null, null, zeroDate);
        const s2 = await createMatch(2, 'semi_final', finalId, 'away', null, null, zeroDate);

        // Q1 (feed S1 Home)
        await createMatch(1, 'quarter_final', s1, 'home', selectedTeams[0]?.id, selectedTeams[1]?.id, matchDate);
        // Q2 (feed S1 Away)
        await createMatch(1, 'quarter_final', s1, 'away', selectedTeams[2]?.id, selectedTeams[3]?.id, matchDate);
        // Q3 (feed S2 Home)
        await createMatch(1, 'quarter_final', s2, 'home', selectedTeams[4]?.id, selectedTeams[5]?.id, matchDate);
        // Q4 (feed S2 Away)
        await createMatch(1, 'quarter_final', s2, 'away', selectedTeams[6]?.id, selectedTeams[7]?.id, matchDate);
        insertedCount = 7;
      } else {
        return res.status(400).json({ success: false, message: 'La generación automática de Copa está limitada a 8 equipos por ahora.' });
      }

      await pool.query('UPDATE tournaments SET status = "in_progress" WHERE id = ?', [tournament_id]);

      return res.status(201).json({
        success: true,
        message: 'Árbol de Copa generado exitosamente',
        data: { matches_count: insertedCount }
      });
    }

    // --- FIN LOGICA KNOCKOUT ---

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

    // 3. Generar Llaves (Full Bracket Tree)
    // Nota: Esta implementación asume Single Leg para la generación automática del árbol completo.

    const qualifiers = standings.slice(0, numQualifiers);
    const date = new Date(start_date || new Date());

    // Determinar la ronda inicial
    const [lastMatch] = await pool.query('SELECT MAX(round) as max_round FROM matches WHERE tournament_id = ?', [tournament_id]);
    let startRound = (lastMatch[0].max_round || 0) + 1;

    // Helper para crear partido
    const createMatch = async (round, stage, nextMatchId = null, nextMatchSlot = null, homeId = null, awayId = null, matchDate) => {
      const [result] = await pool.query(
        `INSERT INTO matches (tournament_id, home_team_id, away_team_id, match_date, round, stage, status, next_match_id, next_match_slot)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [tournament_id, homeId, awayId, matchDate, round, stage, 'scheduled', nextMatchId, nextMatchSlot]
      );
      return result.insertId;
    };

    let insertedCount = 0;

    if (numQualifiers === 4) {
      // --- FINAL (Round + 1) ---
      const finalDate = new Date(date);
      finalDate.setDate(finalDate.getDate() + (parseInt(interval_days) * 2));
      const finalId = await createMatch(startRound + 1, 'final', null, null, null, null, finalDate);
      insertedCount++;

      // --- SEMIS (Round) ---
      const semiDate = new Date(date);

      // Semi 1 (Winner goes to Final Home) -> Seeds: 1 vs 4
      await createMatch(startRound, 'semi_final', finalId, 'home', qualifiers[0].team_id, qualifiers[3].team_id, semiDate);
      insertedCount++;

      // Semi 2 (Winner goes to Final Away) -> Seeds: 2 vs 3
      await createMatch(startRound, 'semi_final', finalId, 'away', qualifiers[1].team_id, qualifiers[2].team_id, semiDate);
      insertedCount++;

    } else if (numQualifiers === 8) {
      // --- FINAL (Round + 2) ---
      const finalDate = new Date(date);
      finalDate.setDate(finalDate.getDate() + (parseInt(interval_days) * 3));
      const finalId = await createMatch(startRound + 2, 'final', null, null, null, null, finalDate);
      insertedCount++;

      // --- SEMIS (Round + 1) ---
      const semiDate = new Date(date);
      semiDate.setDate(semiDate.getDate() + (parseInt(interval_days) * 2));

      const semi1Id = await createMatch(startRound + 1, 'semi_final', finalId, 'home', null, null, semiDate);
      insertedCount++;
      const semi2Id = await createMatch(startRound + 1, 'semi_final', finalId, 'away', null, null, semiDate);
      insertedCount++;

      // --- QUARTERS (Round) ---
      const qDate = new Date(date);

      // Bracket A (Feeds Semi 1)
      // Q1: 1 vs 8 -> Semi 1 Home
      await createMatch(startRound, 'quarter_final', semi1Id, 'home', qualifiers[0].team_id, qualifiers[7].team_id, qDate);
      insertedCount++;
      // Q2: 4 vs 5 -> Semi 1 Away
      await createMatch(startRound, 'quarter_final', semi1Id, 'away', qualifiers[3].team_id, qualifiers[4].team_id, qDate);
      insertedCount++;

      // Bracket B (Feeds Semi 2)
      // Q3: 2 vs 7 -> Semi 2 Home
      await createMatch(startRound, 'quarter_final', semi2Id, 'home', qualifiers[1].team_id, qualifiers[6].team_id, qDate);
      insertedCount++;
      // Q4: 3 vs 6 -> Semi 2 Away
      await createMatch(startRound, 'quarter_final', semi2Id, 'away', qualifiers[2].team_id, qualifiers[5].team_id, qDate);
      insertedCount++;

    } else if (numQualifiers === 2) {
      // Solo Final
      await createMatch(startRound, 'final', null, null, qualifiers[0].team_id, qualifiers[1].team_id, date);
      insertedCount++;
    } else {
      return res.status(400).json({ success: false, message: 'Por ahora solo se soporta generación automática de brackets para 2, 4 u 8 equipos.' });
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
          s.minutes_played || 0
        ]);

        await connection.query(
          `INSERT INTO player_match_stats 
           (match_id, player_id, goals, assists, yellow_cards, red_cards, minutes_played) 
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
      action: 'update',
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
