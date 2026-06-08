/**
 * Generates a fun profile classification for the user's prediction cup.
 * @param {Object} myCupData - Full simulation data
 * @param {Array} selecoes - List of team details (with rankingFifa)
 */
export function generateMyCupProfile(myCupData, selecoes = []) {
  if (!myCupData || !myCupData.knockout || !myCupData.knockout.quarterFinals) {
    return {
      nome: "Espectador Moderado",
      descricao: "Ainda analisando as opções e desenhando o destino do mundial."
    };
  }

  // 1. Resolve teams in Quarterfinals (8 teams)
  const qfMatches = myCupData.knockout.quarterFinals;
  const qfTeamsNames = [];
  qfMatches.forEach((m) => {
    if (m.selecaoA) qfTeamsNames.push(m.selecaoA);
    if (m.selecaoB) qfTeamsNames.push(m.selecaoB);
  });

  const qfTeams = qfTeamsNames.map((name) => {
    const found = selecoes.find((s) => s.nome.toLowerCase() === name.toLowerCase());
    return found || { nome: name, rankingFifa: 50 }; // default to 50 if not found
  });

  const favoritesCount = qfTeams.filter((t) => t.rankingFifa <= 15).length;
  const zebrasCount = qfTeams.filter((t) => t.rankingFifa >= 30).length;

  // 2. Calculate average goals
  let totalGoals = 0;
  let playedMatchesCount = 0;
  let penaltyShootoutsCount = 0;

  // Group stage goals
  const groupPreds = myCupData.groupPredictions || {};
  Object.values(groupPreds).forEach((g) => {
    const matches = g.matches || [];
    matches.forEach((m) => {
      if (m.placarA !== "" && m.placarB !== "") {
        totalGoals += parseInt(m.placarA) + parseInt(m.placarB);
        playedMatchesCount++;
      }
    });
  });

  // Knockout stage goals
  const knockoutRounds = [
    myCupData.knockout.roundOf32,
    myCupData.knockout.roundOf16,
    myCupData.knockout.quarterFinals,
    myCupData.knockout.semiFinals,
    myCupData.knockout.thirdPlace ? [myCupData.knockout.thirdPlace] : [],
    myCupData.knockout.final ? [myCupData.knockout.final] : []
  ];

  knockoutRounds.forEach((round) => {
    if (!Array.isArray(round)) return;
    round.forEach((m) => {
      if (m && m.placarA !== "" && m.placarB !== "") {
        totalGoals += parseInt(m.placarA) + parseInt(m.placarB);
        playedMatchesCount++;
        if (m.decisao === "prorrogacao_penaltis") {
          penaltyShootoutsCount++;
        }
      }
    });
  });

  const averageGoals = playedMatchesCount > 0 ? totalGoals / playedMatchesCount : 0;

  // 3. Evaluate Profile
  // A. Copa das Zebras: 3 or more high FIFA-rank teams in QF
  if (zebrasCount >= 3) {
    return {
      nome: "Caçador de Zebras 🦓",
      descricao: `Sua Copa é marcada por surpresas chocantes! Você colocou ${zebrasCount} azarões no top 8 mundial, contrariando todas as estatísticas oficiais. Um verdadeiro revolucionário do futebol!`
    };
  }

  // B. Copa dos Favoritos: 6 or more top 15 teams in QF
  if (favoritesCount >= 7) {
    return {
      nome: "Analista Tradicionalista 📋",
      descricao: "Sem espaço para surpresas! Sua projeção valorizou a lógica e o histórico das potências tradicionais. As semifinais são verdadeiros choques de gigantes."
    };
  }

  // C. Copa Ofensiva: Average goals above 3.1
  if (averageGoals >= 3.0) {
    return {
      nome: "Roteirista de Espetáculo ⚽🔥",
      descricao: `Goleadas e emoção pura! Com uma média incrível de ${averageGoals.toFixed(2)} gols por jogo, sua Copa de 2026 é a mais ofensiva da história. Puro show para os torcedores!`
    };
  }

  // D. Copa Defensiva: Average goals below 2.0
  if (averageGoals > 0 && averageGoals <= 1.8) {
    return {
      nome: "Estrategista de Ferro 🧊🧱",
      descricao: `Defesas impenetráveis e tensão extrema! Sua Copa teve uma média baixa de ${averageGoals.toFixed(2)} gols por partida, com confrontos decididos nos detalhes táticos ou nos pênaltis.`
    };
  }

  // E. Roteirista do Caos: Lots of shootouts and unexpected results
  if (penaltyShootoutsCount >= 4 || (zebrasCount >= 2 && penaltyShootoutsCount >= 2)) {
    return {
      nome: "Roteirista do Caos 🌀🃏",
      descricao: "Puro drama e emoção cardíaca! Muitas decisões indo para a prorrogação e pênaltis, com viradas improváveis e muito sofrimento. A Copa perfeita para quem ama drama!"
    };
  }

  // Default fallback
  return {
    nome: "Equilibrado e Analítico ⚖️",
    descricao: `Uma Copa justa e competitiva, com média de ${averageGoals.toFixed(2)} gols por partida e uma mescla ideal entre grandes potências e gratas surpresas avançando.`
  };
}
