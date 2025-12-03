const { getPool } = require('../config/mysql');

/**
 * 🏆 Recalcular tabla de posiciones automáticamente
 * 
 * Fórmula de puntos:
 * - Victoria: 3 puntos
 * - Empate: 1 punto
 * - Derrota: 0 puntos
 * 
 * Criterios de ordenamiento:
 * 1. Puntos (descendente)
 * 2. Diferencia de goles (descendente)
 * 3. Goles a favor (descendente)
 * 
 * @param {number} tournamentId - ID del torneo
 * @returns {Promise<void>}
 */
async function calculateStandings(tournamentId) {
  const pool = getPool();

  try {
    // 1. Obtener todos los matches finalizados del torneo
    const [matches] = await pool.query(
      `SELECT home_team_id, away_team_id, home_score, away_score
       FROM matches
       WHERE tournament_id = ? AND status = 'finished'`,
      [tournamentId]
    );

    // 2. Obtener todos los equipos del torneo
    const [teams] = await pool.query(
      `SELECT DISTINCT t.id
       FROM teams t
       INNER JOIN tournaments tour ON t.league_id = tour.league_id
       WHERE tour.id = ?`,
      [tournamentId]
    );

    // 3. Inicializar estadísticas para cada equipo
    const teamStats = {};
    teams.forEach(team => {
      teamStats[team.id] = {
        team_id: team.id,
        matches_played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goals_for: 0,
        goals_against: 0,
        goal_difference: 0,
        points: 0
      };
    });

    // 4. Calcular estadísticas basadas en matches finalizados
    matches.forEach(match => {
      const homeId = match.home_team_id;
      const awayId = match.away_team_id;
      const homeScore = match.home_score;
      const awayScore = match.away_score;

      // Verificar que los equipos existen en teamStats
      if (!teamStats[homeId] || !teamStats[awayId]) {
        return;
      }

      // Actualizar estadísticas del equipo local
      teamStats[homeId].matches_played++;
      teamStats[homeId].goals_for += homeScore;
      teamStats[homeId].goals_against += awayScore;

      // Actualizar estadísticas del equipo visitante
      teamStats[awayId].matches_played++;
      teamStats[awayId].goals_for += awayScore;
      teamStats[awayId].goals_against += homeScore;

      // Determinar resultado
      if (homeScore > awayScore) {
        // Victoria local
        teamStats[homeId].wins++;
        teamStats[homeId].points += 3;
        teamStats[awayId].losses++;
      } else if (homeScore < awayScore) {
        // Victoria visitante
        teamStats[awayId].wins++;
        teamStats[awayId].points += 3;
        teamStats[homeId].losses++;
      } else {
        // Empate
        teamStats[homeId].draws++;
        teamStats[homeId].points += 1;
        teamStats[awayId].draws++;
        teamStats[awayId].points += 1;
      }

      // Calcular diferencia de goles
      teamStats[homeId].goal_difference = teamStats[homeId].goals_for - teamStats[homeId].goals_against;
      teamStats[awayId].goal_difference = teamStats[awayId].goals_for - teamStats[awayId].goals_against;
    });

    // 5. Convertir a array y ordenar
    const standingsArray = Object.values(teamStats).sort((a, b) => {
      // Primero por puntos
      if (b.points !== a.points) return b.points - a.points;
      // Luego por diferencia de goles
      if (b.goal_difference !== a.goal_difference) return b.goal_difference - a.goal_difference;
      // Finalmente por goles a favor
      return b.goals_for - a.goals_for;
    });

    // 6. Asignar posiciones
    standingsArray.forEach((team, index) => {
      team.position = index + 1;
    });

    // 7. Borrar standings actuales del torneo
    await pool.query('DELETE FROM standings WHERE tournament_id = ?', [tournamentId]);

    // 8. Insertar nuevos standings
    for (const stats of standingsArray) {
      await pool.query(
        `INSERT INTO standings 
         (tournament_id, team_id, matches_played, wins, draws, losses, 
          goals_for, goals_against, goal_difference, points, position)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tournamentId,
          stats.team_id,
          stats.matches_played,
          stats.wins,
          stats.draws,
          stats.losses,
          stats.goals_for,
          stats.goals_against,
          stats.goal_difference,
          stats.points,
          stats.position
        ]
      );
    }

    console.log(`Tabla de posiciones actualizada para torneo ${tournamentId}`);
  } catch (error) {
    console.error('Error calculando standings:', error);
    throw error;
  }
}

module.exports = {
  calculateStandings
};
