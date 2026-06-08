/**
 * Generates the Round of 32 matches based on qualified teams.
 * @param {Object} qualifiedTeams - { firstPlaces: [], secondPlaces: [], bestThirdPlaces: [] }
 */
export function generateRoundOf32(qualifiedTeams) {
  const { firstPlaces, secondPlaces, bestThirdPlaces } = qualifiedTeams;

  // Ensure arrays exist
  const firsts = firstPlaces || [];
  const seconds = secondPlaces || [];
  const thirds = bestThirdPlaces || [];

  const roundOf32 = [];

  // Match 1 to 8: First place A-H vs Best third-places 1-8
  for (let i = 0; i < 8; i++) {
    const winner = firsts[i] || { nome: `1º Grupo ${String.fromCharCode(65 + i)}` };
    const third = thirds[i] || { nome: `3º Lugar` };

    roundOf32.push({
      id: `R32-${i + 1}`,
      jogo: `16-avos ${i + 1}`,
      selecaoA: winner.nome,
      selecaoB: third.nome,
      escudoA: winner.escudo,
      escudoB: third.escudo,
      bandeiraA: winner.bandeira,
      bandeiraB: third.bandeira,
      placarA: "",
      placarB: "",
      vencedor: null,
      decisao: "tempo_normal"
    });
  }

  // Match 9 to 12: First place I-L vs Second place J, K, L, I (rotated to avoid group stage rematches)
  const rotationIndex = [9, 10, 11, 8]; // Group J, K, L, I indices in standard A=0, B=1, ...
  for (let i = 0; i < 4; i++) {
    const winnerIdx = 8 + i; // Group I, J, K, L indices
    const winner = firsts[winnerIdx] || { nome: `1º Grupo ${String.fromCharCode(65 + winnerIdx)}` };
    
    const secondGroupIdx = rotationIndex[i];
    const second = seconds[secondGroupIdx] || { nome: `2º Grupo ${String.fromCharCode(65 + secondGroupIdx)}` };

    roundOf32.push({
      id: `R32-${9 + i}`,
      jogo: `16-avos ${9 + i}`,
      selecaoA: winner.nome,
      selecaoB: second.nome,
      escudoA: winner.escudo,
      escudoB: second.escudo,
      bandeiraA: winner.bandeira,
      bandeiraB: second.bandeira,
      placarA: "",
      placarB: "",
      vencedor: null,
      decisao: "tempo_normal"
    });
  }

  // Match 13 to 16: Second place A vs B, C vs D, E vs F, G vs H
  for (let i = 0; i < 4; i++) {
    const idxA = i * 2;
    const idxB = i * 2 + 1;
    const secondA = seconds[idxA] || { nome: `2º Grupo ${String.fromCharCode(65 + idxA)}` };
    const secondB = seconds[idxB] || { nome: `2º Grupo ${String.fromCharCode(65 + idxB)}` };

    roundOf32.push({
      id: `R32-${13 + i}`,
      jogo: `16-avos ${13 + i}`,
      selecaoA: secondA.nome,
      selecaoB: secondB.nome,
      escudoA: secondA.escudo,
      escudoB: secondB.escudo,
      bandeiraA: secondA.bandeira,
      bandeiraB: secondB.bandeira,
      placarA: "",
      placarB: "",
      vencedor: null,
      decisao: "tempo_normal"
    });
  }

  return roundOf32;
}

/**
 * Generates the matches for the next knockout round based on the winners of the previous round.
 * @param {Array} previousRound - Array of completed matches
 * @param {string} stage - 'roundOf16' | 'quarterFinals' | 'semiFinals' | 'finals'
 * @param {Array} selecoes - List of all team details (to resolve shields and flags)
 */
export function generateNextRound(previousRound = [], stage = "roundOf16", selecoes = []) {
  const getTeamDetails = (name) => {
    const found = selecoes.find((s) => s.nome.toLowerCase() === name.toLowerCase());
    return found || { nome: name, bandeira: "", escudo: "" };
  };

  const getMatchWinnerObj = (match) => {
    if (!match || !match.vencedor) return { nome: "TBD", bandeira: "", escudo: "" };
    const isWinnerA = match.vencedor === match.selecaoA;
    return {
      nome: match.vencedor,
      bandeira: isWinnerA ? match.bandeiraA : match.bandeiraB,
      escudo: isWinnerA ? match.escudoA : match.escudoB
    };
  };

  const getMatchLoserObj = (match) => {
    if (!match || !match.vencedor) return { nome: "TBD", bandeira: "", escudo: "" };
    const isWinnerA = match.vencedor === match.selecaoA;
    return {
      nome: isWinnerA ? match.selecaoB : match.selecaoA,
      bandeira: isWinnerA ? match.bandeiraB : match.bandeiraA,
      escudo: isWinnerA ? match.escudoB : match.escudoA
    };
  };

  if (stage === "roundOf16") {
    // 8 matches from R32
    // R16-1: Vencedor R32-1 vs Vencedor R32-13
    // R16-2: Vencedor R32-2 vs Vencedor R32-14
    // R16-3: Vencedor R32-3 vs Vencedor R32-15
    // R16-4: Vencedor R32-4 vs Vencedor R32-16
    // R16-5: Vencedor R32-5 vs Vencedor R32-9
    // R16-6: Vencedor R32-6 vs Vencedor R32-10
    // R16-7: Vencedor R32-7 vs Vencedor R32-11
    // R16-8: Vencedor R32-8 vs Vencedor R32-12
    const pairings = [
      [0, 12], // R32-1 vs R32-13
      [1, 13], // R32-2 vs R32-14
      [2, 14], // R32-3 vs R32-15
      [3, 15], // R32-4 vs R32-16
      [4, 8],  // R32-5 vs R32-9
      [5, 9],  // R32-6 vs R32-10
      [6, 10], // R32-7 vs R32-11
      [7, 11]  // R32-8 vs R32-12
    ];

    return pairings.map((pair, idx) => {
      const teamA = getMatchWinnerObj(previousRound[pair[0]]);
      const teamB = getMatchWinnerObj(previousRound[pair[1]]);
      return {
        id: `R16-${idx + 1}`,
        jogo: `Oitavas ${idx + 1}`,
        selecaoA: teamA.nome,
        selecaoB: teamB.nome,
        escudoA: teamA.escudo,
        escudoB: teamB.escudo,
        bandeiraA: teamA.bandeira,
        bandeiraB: teamB.bandeira,
        placarA: "",
        placarB: "",
        vencedor: null,
        decisao: "tempo_normal"
      };
    });
  }

  if (stage === "quarterFinals") {
    // 4 matches from R16
    // QF-1: Vencedor R16-1 vs Vencedor R16-5
    // QF-2: Vencedor R16-2 vs Vencedor R16-6
    // QF-3: Vencedor R16-3 vs Vencedor R16-7
    // QF-4: Vencedor R16-4 vs Vencedor R16-8
    const pairings = [
      [0, 4], // R16-1 vs R16-5
      [1, 5], // R16-2 vs R16-6
      [2, 6], // R16-3 vs R16-7
      [3, 7]  // R16-4 vs R16-8
    ];

    return pairings.map((pair, idx) => {
      const teamA = getMatchWinnerObj(previousRound[pair[0]]);
      const teamB = getMatchWinnerObj(previousRound[pair[1]]);
      return {
        id: `QF-${idx + 1}`,
        jogo: `Quartas ${idx + 1}`,
        selecaoA: teamA.nome,
        selecaoB: teamB.nome,
        escudoA: teamA.escudo,
        escudoB: teamB.escudo,
        bandeiraA: teamA.bandeira,
        bandeiraB: teamB.bandeira,
        placarA: "",
        placarB: "",
        vencedor: null,
        decisao: "tempo_normal"
      };
    });
  }

  if (stage === "semiFinals") {
    // 2 matches from QF
    // SF-1: Vencedor QF-1 vs Vencedor QF-3
    // SF-2: Vencedor QF-2 vs Vencedor QF-4
    const pairings = [
      [0, 2], // QF-1 vs QF-3
      [1, 3]  // QF-2 vs QF-4
    ];

    return pairings.map((pair, idx) => {
      const teamA = getMatchWinnerObj(previousRound[pair[0]]);
      const teamB = getMatchWinnerObj(previousRound[pair[1]]);
      return {
        id: `SF-${idx + 1}`,
        jogo: `Semifinal ${idx + 1}`,
        selecaoA: teamA.nome,
        selecaoB: teamB.nome,
        escudoA: teamA.escudo,
        escudoB: teamB.escudo,
        bandeiraA: teamA.bandeira,
        bandeiraB: teamB.bandeira,
        placarA: "",
        placarB: "",
        vencedor: null,
        decisao: "tempo_normal"
      };
    });
  }

  if (stage === "finals") {
    // Generates both Third Place and Grand Final from SF
    // Match 1: Disputa do 3º Lugar (Perdedor SF-1 vs Perdedor SF-2)
    // Match 2: Grande Final (Vencedor SF-1 vs Vencedor SF-2)
    const sf1 = previousRound[0];
    const sf2 = previousRound[1];

    const loser1 = getMatchLoserObj(sf1);
    const loser2 = getMatchLoserObj(sf2);

    const winner1 = getMatchWinnerObj(sf1);
    const winner2 = getMatchWinnerObj(sf2);

    const thirdPlaceMatch = {
      id: "3rd-Place",
      jogo: "Disputa do 3º Lugar",
      selecaoA: loser1.nome,
      selecaoB: loser2.nome,
      escudoA: loser1.escudo,
      escudoB: loser2.escudo,
      bandeiraA: loser1.bandeira,
      bandeiraB: loser2.bandeira,
      placarA: "",
      placarB: "",
      vencedor: null,
      decisao: "tempo_normal"
    };

    const finalMatch = {
      id: "Grand-Final",
      jogo: "Grande Final",
      selecaoA: winner1.nome,
      selecaoB: winner2.nome,
      escudoA: winner1.escudo,
      escudoB: winner2.escudo,
      bandeiraA: winner1.bandeira,
      bandeiraB: winner2.bandeira,
      placarA: "",
      placarB: "",
      vencedor: null,
      decisao: "tempo_normal"
    };

    return {
      thirdPlace: thirdPlaceMatch,
      final: finalMatch
    };
  }

  return [];
}
