/**
 * Calculates standings for a list of teams based on their matches.
 * @param {Array} matches - Group matches with placarA and placarB
 * @param {Array} currentStandings - Current standings (if any) to preserve manual tie-breakers
 */
export function calculateGroupStandings(matches = [], currentStandings = []) {
  const teamsMap = {};

  // Initialize team stats from matches
  matches.forEach((match) => {
    [match.selecaoA, match.selecaoB].forEach((teamName) => {
      if (!teamsMap[teamName]) {
        // Find if we have details for icons/flags
        const isTeamA = match.selecaoA === teamName;
        teamsMap[teamName] = {
          nome: teamName,
          pontos: 0,
          jogos: 0,
          vitorias: 0,
          empates: 0,
          derrotas: 0,
          golsPro: 0,
          golsContra: 0,
          saldo: 0,
          bandeira: isTeamA ? match.bandeiraA : match.bandeiraB,
          escudo: isTeamA ? match.escudoA : match.escudoB
        };
      }
    });
  });

  // Calculate stats from matches
  matches.forEach((match) => {
    if (
      match.placarA !== undefined &&
      match.placarB !== undefined &&
      match.placarA !== null &&
      match.placarB !== null &&
      match.placarA !== "" &&
      match.placarB !== ""
    ) {
      const scoreA = parseInt(match.placarA);
      const scoreB = parseInt(match.placarB);

      if (isNaN(scoreA) || isNaN(scoreB)) return;

      const teamA = teamsMap[match.selecaoA];
      const teamB = teamsMap[match.selecaoB];

      teamA.jogos += 1;
      teamB.jogos += 1;

      teamA.golsPro += scoreA;
      teamA.golsContra += scoreB;

      teamB.golsPro += scoreB;
      teamB.golsContra += scoreA;

      if (scoreA > scoreB) {
        teamA.pontos += 3;
        teamA.vitorias += 1;
        teamB.derrotas += 1;
      } else if (scoreB > scoreA) {
        teamB.pontos += 3;
        teamB.vitorias += 1;
        teamA.derrotas += 1;
      } else {
        teamA.pontos += 1;
        teamB.pontos += 1;
        teamA.empates += 1;
        teamB.empates += 1;
      }
    }
  });

  // Calculate goal differences (saldo)
  const standings = Object.values(teamsMap).map((team) => {
    team.saldo = team.golsPro - team.golsContra;
    return team;
  });

  // Sort standings with tie-breaker
  return sortStandings(standings, currentStandings);
}

/**
 * Sorts team standings based on:
 * 1. Points
 * 2. Goal Difference (SG/saldo)
 * 3. Goals Scored (GP/golsPro)
 * 4. Number of Wins (V/vitorias)
 * 5. Relative order in currentStandings (manual override) or Alphabetical order
 */
export function sortStandings(standings, currentStandings = []) {
  const sorted = [...standings].sort((a, b) => {
    // 1. Points
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    // 2. Goal Difference
    if (b.saldo !== a.saldo) return b.saldo - a.saldo;
    // 3. Goals Scored
    if (b.golsPro !== a.golsPro) return b.golsPro - a.golsPro;
    // 4. Wins
    if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;

    // 5. Check if there was a previous relative order (manual override)
    if (currentStandings && currentStandings.length > 0) {
      const idxA = currentStandings.findIndex((t) => t.nome === a.nome);
      const idxB = currentStandings.findIndex((t) => t.nome === b.nome);
      if (idxA >= 0 && idxB >= 0 && idxA !== idxB) {
        return idxA - idxB; // preserve previous ranking order
      }
    }

    // 6. Alphabetical order fallback
    return a.nome.localeCompare(b.nome);
  });

  // Assign positions (1-indexed)
  return sorted.map((team, idx) => ({
    ...team,
    posicao: idx + 1
  }));
}

/**
 * Checks if two adjacent teams are in a technical tie (Points, SG, GP, V are identical).
 */
export function checkTechnicalTie(teamA, teamB) {
  if (!teamA || !teamB) return false;
  return (
    teamA.pontos === teamB.pontos &&
    teamA.saldo === teamB.saldo &&
    teamA.golsPro === teamB.golsPro &&
    teamA.vitorias === teamB.vitorias
  );
}

/**
 * Checks if a technical tie exists anywhere in the group standings.
 */
export function hasTechnicalTie(standings = []) {
  for (let i = 0; i < standings.length - 1; i++) {
    if (checkTechnicalTie(standings[i], standings[i + 1])) {
      return true;
    }
  }
  return false;
}

/**
 * Swaps positions of two teams in the standings manually (manual override).
 */
export function swapStandingsPositions(standings, indexA, indexB) {
  if (indexA < 0 || indexA >= standings.length || indexB < 0 || indexB >= standings.length) {
    return standings;
  }
  const updated = [...standings];
  const temp = updated[indexA];
  updated[indexA] = updated[indexB];
  updated[indexB] = temp;

  // Re-assign positions
  return updated.map((team, idx) => ({
    ...team,
    posicao: idx + 1
  }));
}
