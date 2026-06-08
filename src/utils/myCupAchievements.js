export const MY_CUP_ACHIEVEMENTS_LIST = [
  {
    id: "comecou_copa",
    titulo: "🏁 Começou a Copa",
    descricao: "Preencheu o placar de pelo menos um jogo da fase de grupos.",
    emoji: "🏁"
  },
  {
    id: "fase_grupos_completa",
    titulo: "📋 Fase de Grupos Completa",
    descricao: "Preencheu todos os 72 jogos da fase de grupos.",
    emoji: "📋"
  },
  {
    id: "mestre_tabela",
    titulo: "🧮 Mestre da Tabela",
    descricao: "Finalizou a fase de grupos e definiu todas as tabelas de classificação.",
    emoji: "🧮"
  },
  {
    id: "mata_mata_iniciado",
    titulo: "🔥 Mata-mata Iniciado",
    descricao: "Preencheu o resultado do primeiro jogo das eliminatórias.",
    emoji: "🔥"
  },
  {
    id: "campeao_definido",
    titulo: "🏆 Campeão Definido",
    descricao: "Finalizou toda a Copa e coroou o grande campeão.",
    emoji: "🏆"
  },
  {
    id: "copa_zebras",
    titulo: "🦓 Copa das Zebras",
    descricao: "Colocou pelo menos 3 seleções com ranking FIFA >= 30 nas Quartas de Final.",
    emoji: "🦓"
  },
  {
    id: "chuva_gols",
    titulo: "⚽ Chuva de Gols",
    descricao: "Sua Copa teve uma média de gols alta (média >= 3.0 por partida).",
    emoji: "⚽"
  },
  {
    id: "copa_truncada",
    titulo: "🧊 Copa Truncada",
    descricao: "Sua Copa teve uma média de gols baixa (média <= 1.8 por partida).",
    emoji: "🧊"
  }
];

/**
 * Calculates which achievements are unlocked based on current simulation data.
 * @param {Object} myCupData - Full simulation state
 * @param {Array} selecoes - List of team details (with rankingFifa)
 */
export function calculateMyCupAchievements(myCupData, selecoes = []) {
  if (!myCupData) return MY_CUP_ACHIEVEMENTS_LIST.map(a => ({ ...a, unlocked: false }));

  // Helper stats
  let totalGroupMatches = 0;
  let filledGroupMatches = 0;
  let totalKnockoutMatches = 0;
  let filledKnockoutMatches = 0;
  let totalGoals = 0;
  let playedMatchesCount = 0;
  let zebrasInQuarterFinals = 0;

  // 1. Check Group matches
  const groupPreds = myCupData.groupPredictions || {};
  Object.values(groupPreds).forEach((g) => {
    const matches = g.matches || [];
    matches.forEach((m) => {
      totalGroupMatches++;
      if (m.placarA !== "" && m.placarB !== "") {
        filledGroupMatches++;
        totalGoals += parseInt(m.placarA) + parseInt(m.placarB);
        playedMatchesCount++;
      }
    });
  });

  // 2. Check Knockout matches
  const roundOf32 = myCupData.knockout?.roundOf32 || [];
  const roundOf16 = myCupData.knockout?.roundOf16 || [];
  const quarterFinals = myCupData.knockout?.quarterFinals || [];
  const semiFinals = myCupData.knockout?.semiFinals || [];
  const thirdPlace = myCupData.knockout?.thirdPlace;
  const final = myCupData.knockout?.final;

  const allKnockoutMatches = [
    ...roundOf32,
    ...roundOf16,
    ...quarterFinals,
    ...semiFinals
  ];
  if (thirdPlace) allKnockoutMatches.push(thirdPlace);
  if (final) allKnockoutMatches.push(final);

  allKnockoutMatches.forEach((m) => {
    totalKnockoutMatches++;
    if (m && m.placarA !== "" && m.placarB !== "") {
      filledKnockoutMatches++;
      totalGoals += parseInt(m.placarA) + parseInt(m.placarB);
      playedMatchesCount++;
    }
  });

  // 3. Count Zebras in Quarterfinals
  quarterFinals.forEach((m) => {
    [m.selecaoA, m.selecaoB].forEach((name) => {
      if (name && name !== "TBD") {
        const teamObj = selecoes.find((s) => s.nome.toLowerCase() === name.toLowerCase());
        if (teamObj && teamObj.rankingFifa >= 30) {
          zebrasInQuarterFinals++;
        }
      }
    });
  });

  const averageGoals = playedMatchesCount > 0 ? totalGoals / playedMatchesCount : 0;

  return MY_CUP_ACHIEVEMENTS_LIST.map((ach) => {
    let unlocked = false;

    switch (ach.id) {
      case "comecou_copa":
        unlocked = filledGroupMatches >= 1;
        break;
      case "fase_grupos_completa":
        unlocked = filledGroupMatches === 72; // 12 groups * 6 matches
        break;
      case "mestre_tabela":
        unlocked = myCupData.currentStep !== "intro" && myCupData.currentStep !== "groups";
        break;
      case "mata_mata_iniciado":
        unlocked = filledKnockoutMatches >= 1;
        break;
      case "campeao_definido":
        unlocked = final && final.placarA !== "" && final.placarB !== "" && final.vencedor !== null;
        break;
      case "copa_zebras":
        unlocked = zebrasInQuarterFinals >= 3;
        break;
      case "chuva_gols":
        // Only unlock if at least 15 matches are played to avoid premature unlock
        unlocked = playedMatchesCount >= 15 && averageGoals >= 3.0;
        break;
      case "copa_truncada":
        unlocked = playedMatchesCount >= 15 && averageGoals > 0 && averageGoals <= 1.8;
        break;
      default:
        unlocked = false;
    }

    return {
      ...ach,
      unlocked
    };
  });
}
