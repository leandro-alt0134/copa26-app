const MY_CUP_STORAGE_KEY = "copa2026_minha_copa";
const INDIVIDUAL_STORAGE_KEY = "copa2026_palpites";

export const INITIAL_CUP_STATE = {
  id: "default",
  name: "Minha Copa dos Palpites",
  createdAt: null,
  updatedAt: null,
  status: "in_progress", // "in_progress" | "completed"
  currentStep: "intro", // "intro" | "groups" | "qualified" | "knockout" | "champion"
  groupPredictions: {}, // { "A": { matches: [], standings: [], manualOrderApplied: false } }
  qualifiedTeams: {
    firstPlaces: [],
    secondPlaces: [],
    bestThirdPlaces: []
  },
  knockout: {
    roundOf32: [],
    roundOf16: [],
    quarterFinals: [],
    semiFinals: [],
    thirdPlace: null,
    final: null
  },
  champion: null,
  runnerUp: null,
  thirdPlace: null,
  profile: null // { name, description }
};

export function loadMyCupData() {
  try {
    const data = localStorage.getItem(MY_CUP_STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (err) {
    console.error("Erro ao carregar Minha Copa do localStorage:", err);
    return null;
  }
}

export function saveMyCupData(data) {
  try {
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(MY_CUP_STORAGE_KEY, JSON.stringify(updatedData));
    return updatedData;
  } catch (err) {
    console.error("Erro ao salvar Minha Copa no localStorage:", err);
    return null;
  }
}

export function resetMyCupData() {
  try {
    localStorage.removeItem(MY_CUP_STORAGE_KEY);
    return true;
  } catch (err) {
    console.error("Erro ao resetar dados de Minha Copa:", err);
    return false;
  }
}

/**
 * Prefills group matches based on existing individual predictions.
 * Matches from public/data/partidas.json are matched against individual predictions (copa2026_palpites).
 */
export function importFromIndividualPredictions(allMatches) {
  try {
    const rawIndividual = localStorage.getItem(INDIVIDUAL_STORAGE_KEY);
    if (!rawIndividual) return {};

    const individualPalpites = JSON.parse(rawIndividual);
    if (!Array.isArray(individualPalpites)) return {};

    const groupPredictions = {};

    // Group matches by group name A-L
    allMatches.forEach((match) => {
      const gLetter = match.grupo;
      if (!groupPredictions[gLetter]) {
        groupPredictions[gLetter] = {
          matches: [],
          standings: [],
          manualOrderApplied: false
        };
      }

      // Find if there's a user prediction for this matchId
      const palpite = individualPalpites.find((p) => p.matchId === match.id);

      groupPredictions[gLetter].matches.push({
        matchId: match.id,
        selecaoA: match.selecaoA,
        selecaoB: match.selecaoB,
        escudoA: match.escudoA,
        escudoB: match.escudoB,
        bandeiraA: match.bandeiraA,
        bandeiraB: match.bandeiraB,
        placarA: palpite && palpite.placar ? palpite.placar.selecaoA : "",
        placarB: palpite && palpite.placar ? palpite.placar.selecaoB : ""
      });
    });

    return groupPredictions;
  } catch (err) {
    console.error("Erro ao importar palpites individuais:", err);
    return {};
  }
}

/**
 * Prefills group matches based on cached official results from API.
 */
export function importFromOfficialResults(allMatches) {
  try {
    const cachedMatches = localStorage.getItem("copa2026_partidas_atualizadas");
    if (!cachedMatches) return {};

    const updatedMatches = JSON.parse(cachedMatches);
    if (!Array.isArray(updatedMatches)) return {};

    const groupPredictions = {};

    allMatches.forEach((match) => {
      const gLetter = match.grupo;
      if (!groupPredictions[gLetter]) {
        groupPredictions[gLetter] = {
          matches: [],
          standings: [],
          manualOrderApplied: false
        };
      }

      // Procura se essa partida tem resultado oficial salvo no cache
      const official = updatedMatches.find((p) => p.id === match.id);

      groupPredictions[gLetter].matches.push({
        matchId: match.id,
        selecaoA: match.selecaoA,
        selecaoB: match.selecaoB,
        escudoA: match.escudoA,
        escudoB: match.escudoB,
        bandeiraA: match.bandeiraA,
        bandeiraB: match.bandeiraB,
        placarA: official && official.encerrada && official.golsRealA !== undefined ? official.golsRealA.toString() : "",
        placarB: official && official.encerrada && official.golsRealB !== undefined ? official.golsRealB.toString() : ""
      });
    });

    return groupPredictions;
  } catch (err) {
    console.error("Erro ao importar resultados oficiais:", err);
    return {};
  }
}

/**
 * Overwrites individual predictions with the results of this Cup projection.
 */
export function saveAsIndividualPredictions(myCupData) {
  try {
    const rawIndividual = localStorage.getItem(INDIVIDUAL_STORAGE_KEY) || "[]";
    let individualPalpites = JSON.parse(rawIndividual);
    if (!Array.isArray(individualPalpites)) individualPalpites = [];

    // Collect all matches from group stage predictions
    const groupPreds = myCupData.groupPredictions || {};
    const timestamp = new Date().toISOString();

    Object.keys(groupPreds).forEach((gLetter) => {
      const matches = groupPreds[gLetter].matches || [];
      matches.forEach((m) => {
        if (m.placarA !== "" && m.placarB !== "") {
          const scoreA = parseInt(m.placarA);
          const scoreB = parseInt(m.placarB);
          
          let palpiteFinal = "Empate";
          if (scoreA > scoreB) palpiteFinal = m.selecaoA;
          else if (scoreB > scoreA) palpiteFinal = m.selecaoB;

          const newPalpite = {
            matchId: m.matchId,
            grupo: gLetter,
            rodada: 1, // rodada demonstrativa
            selecaoA: m.selecaoA,
            selecaoB: m.selecaoB,
            tipoPalpite: "rapido",
            respostas: {},
            pontuacao: {
              selecaoA: scoreA > scoreB ? 3 : scoreA === scoreB ? 1 : 0,
              empate: scoreA === scoreB ? 3 : 0,
              selecaoB: scoreB > scoreA ? 3 : scoreA === scoreB ? 1 : 0
            },
            nivelConfianca: "Normal",
            perfilPalpiteiro: "Palpiteiro da Copa",
            totalPerguntas: 0,
            resultadoSugerido: palpiteFinal,
            palpiteFinal: palpiteFinal,
            placar: {
              selecaoA: scoreA,
              selecaoB: scoreB
            },
            createdAt: timestamp
          };

          // Find and update or insert
          const idx = individualPalpites.findIndex((item) => item.matchId === m.matchId);
          if (idx >= 0) {
            individualPalpites[idx] = newPalpite;
          } else {
            individualPalpites.push(newPalpite);
          }
        }
      });
    });

    localStorage.setItem(INDIVIDUAL_STORAGE_KEY, JSON.stringify(individualPalpites));
    return true;
  } catch (err) {
    console.error("Erro ao salvar Minha Copa como palpites individuais:", err);
    return false;
  }
}
