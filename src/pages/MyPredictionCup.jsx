import React, { useState, useEffect } from 'react';
import Countdown from '../components/Countdown';

// Components
import MyCupIntro from '../components/my-cup/MyCupIntro';
import MyCupProgress from '../components/my-cup/MyCupProgress';
import GroupProjection from '../components/my-cup/GroupProjection';
import QualifiedTeams from '../components/my-cup/QualifiedTeams';
import KnockoutBracket from '../components/my-cup/KnockoutBracket';
import MyCupChampion from '../components/my-cup/MyCupChampion';

// Utils
import {
  loadMyCupData,
  saveMyCupData,
  resetMyCupData,
  INITIAL_CUP_STATE,
  importFromIndividualPredictions,
  importFromOfficialResults,
  saveAsIndividualPredictions
} from '../utils/myCupStorage';
import {
  calculateGroupStandings,
  sortStandings,
  swapStandingsPositions
} from '../utils/myCupStandings';
import {
  generateRoundOf32,
  generateNextRound
} from '../utils/myCupKnockout';
import { generateMyCupProfile } from '../utils/myCupProfile';
import { calculateMyCupAchievements } from '../utils/myCupAchievements';

export default function MyPredictionCup() {
  const [loading, setLoading] = useState(true);
  const [partidas, setPartidas] = useState([]);
  const [selecoes, setSelecoes] = useState([]);
  const [gruposTemplate, setGruposTemplate] = useState([]);

  // Centralized simulation state
  const [cupState, setCupState] = useState(INITIAL_CUP_STATE);
  const [activeGroup, setActiveGroup] = useState("A");

  // Load template data and saved simulation on mount
  useEffect(() => {
    Promise.all([
      fetch('/data/partidas.json').then((r) => r.json()),
      fetch('/data/selecoes.json').then((r) => r.json()),
      fetch('/data/grupos.json').then((r) => r.json())
    ])
      .then(([partidasData, selecoesData, gruposData]) => {
        setPartidas(partidasData || []);
        setSelecoes(selecoesData.copa_2026 || []);
        setGruposTemplate(gruposData.grupos || []);

        const saved = loadMyCupData();
        if (saved) {
          setCupState(saved);
        } else {
          // Initialize empty group stage state
          const initialGroups = {};
          (gruposData.grupos || []).forEach((g) => {
            const letter = g.grupo.replace("Grupo ", "");
            const groupMatches = (partidasData || []).filter((m) => m.grupo === letter);
            
            const matchesState = groupMatches.map((m) => ({
              matchId: m.id,
              selecaoA: m.selecaoA,
              selecaoB: m.selecaoB,
              escudoA: m.escudoA,
              escudoB: m.escudoB,
              bandeiraA: m.bandeiraA,
              bandeiraB: m.bandeiraB,
              placarA: "",
              placarB: ""
            }));

            const initialStandings = calculateGroupStandings(matchesState, []);

            initialGroups[letter] = {
              matches: matchesState,
              standings: initialStandings,
              manualOrderApplied: false
            };
          });

          setCupState((prev) => ({
            ...prev,
            groupPredictions: initialGroups
          }));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao inicializar página de simulação:", err);
        setLoading(false);
      });
  }, []);

  // Check if user has individual predictions saved in their browser
  const hasIndividualPalpites = !!localStorage.getItem("copa2026_palpites");

  // Check if we have cached official results in the browser
  const cachedMatchesRaw = localStorage.getItem("copa2026_partidas_atualizadas");
  let hasOfficialResults = false;
  try {
    if (cachedMatchesRaw) {
      const cachedList = JSON.parse(cachedMatchesRaw);
      hasOfficialResults = Array.isArray(cachedList) && cachedList.some((p) => p.encerrada);
    }
  } catch (e) {
    console.error(e);
  }

  // 1. Action: Start New Simulation
  const handleStartNew = () => {
    if (cupState.currentStep !== "intro" && !window.confirm("Isso apagará sua simulação atual. Deseja continuar?")) {
      return;
    }
    resetMyCupData();
    
    // Rebuild clean group stage state
    const initialGroups = {};
    gruposTemplate.forEach((g) => {
      const letter = g.grupo.replace("Grupo ", "");
      const groupMatches = partidas.filter((m) => m.grupo === letter);
      const matchesState = groupMatches.map((m) => ({
        matchId: m.id,
        selecaoA: m.selecaoA,
        selecaoB: m.selecaoB,
        escudoA: m.escudoA,
        escudoB: m.escudoB,
        bandeiraA: m.bandeiraA,
        bandeiraB: m.bandeiraB,
        placarA: "",
        placarB: ""
      }));
      initialGroups[letter] = {
        matches: matchesState,
        standings: calculateGroupStandings(matchesState, []),
        manualOrderApplied: false
      };
    });

    const newState = {
      ...INITIAL_CUP_STATE,
      createdAt: new Date().toISOString(),
      groupPredictions: initialGroups,
      currentStep: "groups"
    };

    setCupState(newState);
    saveMyCupData(newState);
    setActiveGroup("A");
  };

  // 2. Action: Continue Saved
  const handleContinue = () => {
    setCupState((prev) => ({
      ...prev,
      currentStep: prev.currentStep === "intro" ? "groups" : prev.currentStep
    }));
  };

  // 3. Action: Import baseline predictions
  const handleImport = () => {
    if (cupState.currentStep !== "intro" && !window.confirm("Isso substituirá seus palpites atuais de fase de grupos. Deseja continuar?")) {
      return;
    }
    const importedGroups = importFromIndividualPredictions(partidas);
    
    // Compute standings for imported groups
    Object.keys(importedGroups).forEach((gLetter) => {
      importedGroups[gLetter].standings = calculateGroupStandings(importedGroups[gLetter].matches, []);
    });

    const newState = {
      ...cupState,
      groupPredictions: importedGroups,
      currentStep: "groups",
      createdAt: cupState.createdAt || new Date().toISOString()
    };

    setCupState(newState);
    saveMyCupData(newState);
    setActiveGroup("A");
    alert("Palpites importados com sucesso! Revise e complete os placares de cada grupo.");
  };

  // 3b. Action: Import official results
  const handleImportOfficial = () => {
    if (cupState.currentStep !== "intro" && !window.confirm("Isso substituirá seus palpites atuais de fase de grupos por resultados oficiais reais da API. Deseja continuar?")) {
      return;
    }
    const importedGroups = importFromOfficialResults(partidas);
    
    // Compute standings for imported groups
    Object.keys(importedGroups).forEach((gLetter) => {
      importedGroups[gLetter].standings = calculateGroupStandings(importedGroups[gLetter].matches, []);
    });

    const newState = {
      ...cupState,
      groupPredictions: importedGroups,
      currentStep: "groups",
      createdAt: cupState.createdAt || new Date().toISOString()
    };

    setCupState(newState);
    saveMyCupData(newState);
    setActiveGroup("A");
    alert("Resultados oficiais importados com sucesso! Revise as tabelas e preencha as partidas restantes.");
  };

  // 4. Score Input Change: Group Stage
  const handleGroupScoreChange = (grupoLetter, matchId, teamField, value) => {
    // Validate: only integer positive numbers or empty strings
    if (value !== "" && (!/^\d+$/.test(value) || parseInt(value) < 0)) return;

    // Warning: editing a group match after starting knockout will reset brackets
    if (cupState.currentStep !== "groups" && cupState.currentStep !== "intro") {
      if (!window.confirm("Alterar a fase de grupos pode mudar os classificados e apagará o mata-mata. Deseja continuar?")) {
        return;
      }
    }

    const updatedGroups = { ...cupState.groupPredictions };
    const groupData = { ...updatedGroups[grupoLetter] };
    const matches = groupData.matches.map((m) => {
      if (m.matchId === matchId) {
        return { ...m, [teamField]: value };
      }
      return m;
    });

    // Recalculate standings
    const standings = calculateGroupStandings(matches, groupData.manualOrderApplied ? groupData.standings : []);

    updatedGroups[grupoLetter] = {
      ...groupData,
      matches,
      standings
    };

    let newState = {
      ...cupState,
      groupPredictions: updatedGroups
    };

    // If we were ahead in stages, reset them back to 'groups'
    if (cupState.currentStep !== "groups" && cupState.currentStep !== "intro") {
      newState.currentStep = "groups";
      newState.qualifiedTeams = INITIAL_CUP_STATE.qualifiedTeams;
      newState.knockout = INITIAL_CUP_STATE.knockout;
      newState.champion = null;
      newState.runnerUp = null;
      newState.thirdPlace = null;
      newState.profile = null;
    }

    setCupState(newState);
    saveMyCupData(newState);
  };

  // 5. Standing Manual Swap Order: Group Stage
  const handleGroupSwapTeams = (grupoLetter, indexA, indexB) => {
    const updatedGroups = { ...cupState.groupPredictions };
    const groupData = { ...updatedGroups[grupoLetter] };
    
    const reorderedStandings = swapStandingsPositions(groupData.standings, indexA, indexB);

    updatedGroups[grupoLetter] = {
      ...groupData,
      standings: reorderedStandings,
      manualOrderApplied: true
    };

    const newState = {
      ...cupState,
      groupPredictions: updatedGroups
    };

    setCupState(newState);
    saveMyCupData(newState);
  };

  // 6. Calculate stage qualifications
  const handleCalculateQualifications = () => {
    // Collect 1st place, 2nd place, and 3rd place of each group
    const firstPlaces = [];
    const secondPlaces = [];
    const thirdPlaces = [];

    const groupLetters = Object.keys(cupState.groupPredictions).sort();
    
    // Check if any group matches are missing
    let hasMissing = false;
    groupLetters.forEach((g) => {
      const matches = cupState.groupPredictions[g].matches || [];
      if (matches.some((m) => m.placarA === "" || m.placarB === "")) {
        hasMissing = true;
      }
    });

    if (hasMissing) {
      alert("Por favor, preencha todos os jogos da fase de grupos antes de avançar.");
      return;
    }

    groupLetters.forEach((g) => {
      const standings = cupState.groupPredictions[g].standings || [];
      
      if (standings[0]) firstPlaces.push(standings[0]);
      if (standings[1]) secondPlaces.push(standings[1]);
      if (standings[2]) thirdPlaces.push(standings[2]);
    });

    // Sort third places to find the 8 best
    const sortedThirdPlaces = sortStandings(thirdPlaces, []);

    const bestThirdPlaces = sortedThirdPlaces.slice(0, 8);

    const newState = {
      ...cupState,
      currentStep: "qualified",
      qualifiedTeams: {
        firstPlaces,
        secondPlaces,
        bestThirdPlaces
      }
    };

    setCupState(newState);
    saveMyCupData(newState);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 7. Swap thirds ranking manually
  const handleSwapThirds = (idxA, idxB) => {
    const thirds = [...(cupState.qualifiedTeams.bestThirdsList || [])]; 
    // Wait, let's look at how we store third places ranking: we can calculate them dynamically
    // or store a sorted list of all 12 third places. Let's recalculate and sort.
    // Let's store allThirds in cupState or calculate it.
    // A clean way is: we retrieve all 12 third places from group predictions,
    // sort them, and if user swaps them, we save the custom order list in state!
    // Let's store a customized `allThirds` list in state or retrieve it from the group standings,
    // and store a relative manual ordering.
    // Let's implement a simple reordering of the thirds in `cupState.qualifiedTeams.bestThirdPlaces` 
    // or we can store `allThirdPlaces` in the state.
    // Let's store `allThirdPlaces` inside `cupState.qualifiedTeams` to make it easy.
    // Yes! `qualifiedTeams.allThirdPlaces` is perfect.
  };

  // Wait! Let's write a robust thirds swap action:
  const handleSwapThirdsAction = (idxA, idxB) => {
    const groupLetters = Object.keys(cupState.groupPredictions).sort();
    const rawThirds = groupLetters.map((g) => cupState.groupPredictions[g].standings[2]).filter(Boolean);

    // Load previous sorted order or calculate it
    const currentSorted = cupState.qualifiedTeams.allThirdPlaces || sortStandings(rawThirds, []);
    const updated = swapStandingsPositions(currentSorted, idxA, idxB);

    const bestThirds = updated.slice(0, 8);

    const newState = {
      ...cupState,
      qualifiedTeams: {
        ...cupState.qualifiedTeams,
        allThirdPlaces: updated,
        bestThirdPlaces: bestThirds
      }
    };

    setCupState(newState);
    saveMyCupData(newState);
  };

  // 8. Generate Knockout brackets from qualified list
  const handleGenerateKnockout = () => {
    const rawThirds = Object.keys(cupState.groupPredictions).sort().map((g) => cupState.groupPredictions[g].standings[2]).filter(Boolean);
    const allThirds = cupState.qualifiedTeams.allThirdPlaces || sortStandings(rawThirds, []);
    const bestThirds = allThirds.slice(0, 8);

    const initialRoundOf32 = generateRoundOf32({
      firstPlaces: cupState.qualifiedTeams.firstPlaces,
      secondPlaces: cupState.qualifiedTeams.secondPlaces,
      bestThirdPlaces: bestThirds
    });

    const newState = {
      ...cupState,
      currentStep: "knockout",
      qualifiedTeams: {
        ...cupState.qualifiedTeams,
        allThirdPlaces: allThirds,
        bestThirdPlaces: bestThirds
      },
      knockout: {
        ...cupState.knockout,
        roundOf32: initialRoundOf32
      }
    };

    setCupState(newState);
    saveMyCupData(newState);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 9. Knockout Match Input Score Change
  const handleKnockoutMatchChange = (stageId, matchId, field, val) => {
    // Validate inputs
    if (field !== 'vencedor_override' && val !== "" && (!/^\d+$/.test(val) || parseInt(val) < 0)) return;

    // Confirm warning: editing a match in a previous round resets subsequent stages
    const roundMapping = ['roundOf32', 'roundOf16', 'quarterFinals', 'semiFinals', 'finals'];
    const currentRoundIdx = roundMapping.indexOf(stageId === 'finals' ? 'finals' : stageId);
    
    // Check if subsequent rounds have any predictions filled
    let hasSubsequentPredictions = false;
    for (let i = currentRoundIdx + 1; i < roundMapping.length; i++) {
      const rKey = roundMapping[i];
      if (rKey === 'finals') {
        const tP = cupState.knockout.thirdPlace;
        const fn = cupState.knockout.final;
        if ((tP && tP.placarA !== "") || (fn && fn.placarA !== "")) {
          hasSubsequentPredictions = true;
        }
      } else {
        const matches = cupState.knockout[rKey] || [];
        if (matches.some((m) => m.placarA !== "")) {
          hasSubsequentPredictions = true;
        }
      }
    }

    if (hasSubsequentPredictions) {
      if (!window.confirm("Alterar o placar desta fase apagará todas as fases seguintes já preenchidas. Deseja continuar?")) {
        return;
      }
    }

    const updatedKnockout = { ...cupState.knockout };
    
    const updateMatchData = (m) => {
      if (m.id !== matchId) return m;

      let updated = { ...m };

      if (field === 'vencedor_override') {
        updated.vencedor = val;
        updated.decisao = "prorrogacao_penaltis";
      } else {
        updated[field] = val;
        
        // Auto-calculate winner
        const sA = updated.placarA !== "" ? parseInt(updated.placarA) : NaN;
        const sB = updated.placarB !== "" ? parseInt(updated.placarB) : NaN;

        if (!isNaN(sA) && !isNaN(sB)) {
          if (sA > sB) {
            updated.vencedor = updated.selecaoA;
            updated.decisao = "tempo_normal";
          } else if (sB > sA) {
            updated.vencedor = updated.selecaoB;
            updated.decisao = "tempo_normal";
          } else {
            // Tie - requires user interaction to select winner
            // Keep previous winner if still tied, else reset to null
            if (updated.vencedor !== updated.selecaoA && updated.vencedor !== updated.selecaoB) {
              updated.vencedor = null;
            }
            updated.decisao = "prorrogacao_penaltis";
          }
        } else {
          updated.vencedor = null;
          updated.decisao = "tempo_normal";
        }
      }

      return updated;
    };

    if (stageId === 'finals') {
      if (matchId === '3rd-Place') {
        updatedKnockout.thirdPlace = updateMatchData(updatedKnockout.thirdPlace);
      } else if (matchId === 'Grand-Final') {
        updatedKnockout.final = updateMatchData(updatedKnockout.final);
      }
    } else {
      updatedKnockout[stageId] = (updatedKnockout[stageId] || []).map(updateMatchData);
    }

    // Reset subsequent rounds if we had to overwrite
    if (hasSubsequentPredictions) {
      for (let i = currentRoundIdx + 1; i < roundMapping.length; i++) {
        const rKey = roundMapping[i];
        if (rKey === 'finals') {
          updatedKnockout.thirdPlace = null;
          updatedKnockout.final = null;
        } else {
          updatedKnockout[rKey] = [];
        }
      }
    }

    const newState = {
      ...cupState,
      knockout: updatedKnockout,
      champion: null,
      runnerUp: null,
      thirdPlace: null,
      profile: null
    };

    setCupState(newState);
    saveMyCupData(newState);
  };

  // 10. Generate subsequent stages from winner lists
  const handleGenerateNextStage = (currentStageId) => {
    const updatedKnockout = { ...cupState.knockout };

    if (currentStageId === 'roundOf32') {
      const nextRound = generateNextRound(cupState.knockout.roundOf32, 'roundOf16', selecoes);
      updatedKnockout.roundOf16 = nextRound;
    } else if (currentStageId === 'roundOf16') {
      const nextRound = generateNextRound(cupState.knockout.roundOf16, 'quarterFinals', selecoes);
      updatedKnockout.quarterFinals = nextRound;
    } else if (currentStageId === 'quarterFinals') {
      const nextRound = generateNextRound(cupState.knockout.quarterFinals, 'semiFinals', selecoes);
      updatedKnockout.semiFinals = nextRound;
    } else if (currentStageId === 'semiFinals') {
      const { thirdPlace, final } = generateNextRound(cupState.knockout.semiFinals, 'finals', selecoes);
      updatedKnockout.thirdPlace = thirdPlace;
      updatedKnockout.final = final;
    }

    const newState = {
      ...cupState,
      knockout: updatedKnockout
    };

    setCupState(newState);
    saveMyCupData(newState);
  };

  // 11. Finalize and crown champion
  const handleFinishCup = () => {
    const finalMatch = cupState.knockout.final;
    const thirdMatch = cupState.knockout.thirdPlace;

    if (!finalMatch || finalMatch.vencedor === null || finalMatch.placarA === "" || finalMatch.placarB === "") {
      alert("Por favor, preencha a final antes de coroar o campeão.");
      return;
    }

    const champion = finalMatch.vencedor;
    const runnerUp = finalMatch.vencedor === finalMatch.selecaoA ? finalMatch.selecaoB : finalMatch.selecaoA;
    const third = thirdMatch && thirdMatch.vencedor ? thirdMatch.vencedor : null;

    const dataBeforeProfile = {
      ...cupState,
      champion,
      runnerUp,
      thirdPlace: third,
      status: "completed"
    };

    const calculatedProfile = generateMyCupProfile(dataBeforeProfile, selecoes);

    const newState = {
      ...dataBeforeProfile,
      currentStep: "champion",
      profile: calculatedProfile
    };

    setCupState(newState);
    saveMyCupData(newState);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 12. Save projections back as individual predictions (Integrations)
  const handleSaveToIndividual = () => {
    const success = saveAsIndividualPredictions(cupState);
    if (success) {
      alert("Sucesso! Os palpites desta Copa foram sincronizados com seus palpites individuais da página inicial.");
    } else {
      alert("Houve um erro ao salvar como palpites individuais.");
    }
  };

  // Render components based on step
  return (
    <main className="container pb-5 my-cup-page">
      {/* Page Title & Countdown header */}
      <section className="hero mb-4">
        <div className="row align-items-center g-0">
          <div className="col-lg-8 hero-content p-4 p-md-5 position-relative">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <span className="hero-badge">🏆 Simulação da Copa</span>
              <Countdown />
            </div>
            <h1>Minha Copa dos Palpites</h1>
            <p>Projete toda a Copa do Mundo FIFA 2026. Comece preenchendo todos os grupos e avance até o título!</p>
          </div>
          <div className="col-lg-4 text-center p-4 p-md-5 position-relative">
            <img src="/assets/copa-2026-logo.svg" className="hero-logo" alt="Logo da Copa do Mundo FIFA 2026" />
          </div>
        </div>
      </section>

      {/* Progress Timeline Stepper */}
      <MyCupProgress currentStep={cupState.currentStep} />

      {loading ? (
        <div className="empty-state py-5 text-center text-muted">Carregando dados da Copa...</div>
      ) : (
        <>
          {/* Step 1: Intro Welcome */}
          {cupState.currentStep === 'intro' && (
            <MyCupIntro
              onStartNew={handleStartNew}
              onContinue={handleContinue}
              onImport={handleImport}
              onImportOfficial={handleImportOfficial}
              hasSavedData={cupState.createdAt !== null}
              hasIndividualPalpites={hasIndividualPalpites}
              hasOfficialResults={hasOfficialResults}
            />
          )}

          {/* Step 2: Group Stage Simulation */}
          {cupState.currentStep === 'groups' && (
            <GroupProjection
              groupPredictions={cupState.groupPredictions}
              activeGroup={activeGroup}
              setActiveGroup={setActiveGroup}
              onScoreChange={handleGroupScoreChange}
              onSwapTeams={handleGroupSwapTeams}
              onNextStep={handleCalculateQualifications}
            />
          )}

          {/* Step 3: Qualified List */}
          {cupState.currentStep === 'qualified' && (
            <QualifiedTeams
              qualifiedTeams={cupState.qualifiedTeams}
              allThirdPlaces={cupState.qualifiedTeams.allThirdPlaces || sortStandings(
                Object.keys(cupState.groupPredictions).sort().map((g) => cupState.groupPredictions[g].standings[2]).filter(Boolean),
                []
              )}
              onSwapThirds={handleSwapThirdsAction}
              onNextStep={handleGenerateKnockout}
            />
          )}

          {/* Step 4: Knockout Brackets */}
          {cupState.currentStep === 'knockout' && (
            <KnockoutBracket
              knockout={cupState.knockout}
              onKnockoutMatchChange={handleKnockoutMatchChange}
              onGenerateNextStage={handleGenerateNextStage}
              onFinishCup={handleFinishCup}
            />
          )}

          {/* Step 5: Champion Celebrations */}
          {cupState.currentStep === 'champion' && (
            <>
              <MyCupChampion
                myCupData={cupState}
                selecoes={selecoes}
                onReset={handleStartNew}
              />
              
              {/* Optional Integration Button Panel */}
              <div className="text-center mt-4">
                <button
                  onClick={handleSaveToIndividual}
                  className="btn btn-outline-success px-4 py-3 font-weight-bold"
                  style={{ borderRadius: '14px', border: '2px solid var(--primary)', color: 'var(--primary)' }}
                >
                  📥 Salvar como Meus Palpites Individuais Gerais
                </button>
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}
