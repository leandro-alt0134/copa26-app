import React from 'react';
import GroupStandings from './GroupStandings';

const GROUPS_LIST = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

export default function GroupProjection({
  groupPredictions = {},
  activeGroup,
  setActiveGroup,
  onScoreChange,
  onSwapTeams,
  onNextStep
}) {
  // 1. Calculate overall progress
  let totalMatches = 72;
  let filledMatches = 0;

  GROUPS_LIST.forEach((g) => {
    const data = groupPredictions[g] || {};
    const matches = data.matches || [];
    matches.forEach((m) => {
      if (m.placarA !== "" && m.placarB !== "") {
        filledMatches++;
      }
    });
  });

  const progressPercent = (filledMatches / totalMatches) * 100;

  // 2. Calculate status for each group
  const groupStats = GROUPS_LIST.reduce((acc, g) => {
    const data = groupPredictions[g] || {};
    const matches = data.matches || [];
    const filledCount = matches.filter((m) => m.placarA !== "" && m.placarB !== "").length;

    let status = "not_started";
    let label = "Não iniciado";
    let badgeClass = "text-bg-secondary";

    if (filledCount === 6) {
      status = "completed";
      label = "Completo";
      badgeClass = "text-bg-success";
    } else if (filledCount > 0) {
      status = "in_progress";
      label = `Em andamento (${filledCount}/6)`;
      badgeClass = "text-bg-warning";
    }

    acc[g] = { status, label, badgeClass, filledCount };
    return acc;
  }, {});

  const currentGroupData = groupPredictions[activeGroup] || { matches: [], standings: [], manualOrderApplied: false };
  const currentGroupMatches = currentGroupData.matches || [];
  const currentGroupStandings = currentGroupData.standings || [];

  const handlePrevGroup = () => {
    const idx = GROUPS_LIST.indexOf(activeGroup);
    if (idx > 0) setActiveGroup(GROUPS_LIST[idx - 1]);
  };

  const handleNextGroup = () => {
    const idx = GROUPS_LIST.indexOf(activeGroup);
    if (idx < GROUPS_LIST.length - 1) setActiveGroup(GROUPS_LIST[idx + 1]);
  };

  const isAllGroupsFinished = filledMatches === totalMatches;

  return (
    <div className="group-projection-container animate-fade-in">
      {/* Progress Section */}
      <section className="card match-picker-card p-4 mb-4">
        <h3 className="h6 text-muted-old mb-2 uppercase text-center font-weight-800">
          Progresso da Fase de Grupos
        </h3>
        <p className="text-white text-center font-weight-bold mb-2">
          Você já projetou {filledMatches} de {totalMatches} jogos da fase de grupos.
        </p>
        <div className="quiz-progress-track mb-2">
          <div 
            className="quiz-progress-fill" 
            style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #FFD166, #00C853)' }}
          />
        </div>
      </section>

      {/* Tabs Navigation for Desktop / Select for Mobile */}
      <div className="mb-4">
        {/* Mobile Dropdown */}
        <div className="d-block d-md-none">
          <label htmlFor="group-select" className="form-label text-muted small uppercase font-weight-bold">
            Selecione o Grupo
          </label>
          <select
            id="group-select"
            className="form-select mb-3"
            value={activeGroup}
            onChange={(e) => setActiveGroup(e.target.value)}
          >
            {GROUPS_LIST.map((g) => (
              <option key={g} value={g}>
                Grupo {g} — {groupStats[g].label}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Tabs */}
        <div className="d-none d-md-flex flex-wrap gap-2 justify-content-center">
          {GROUPS_LIST.map((g) => {
            const stats = groupStats[g];
            let borderStyle = '1px solid rgba(255, 255, 255, 0.15)';
            if (activeGroup === g) {
              borderStyle = '1px solid var(--accent)';
            }

            let indicatorColor = '#6c757d'; // gray
            if (stats.status === 'completed') indicatorColor = '#00C853'; // green
            else if (stats.status === 'in_progress') indicatorColor = '#FFD166'; // yellow

            return (
              <button
                key={g}
                onClick={() => setActiveGroup(g)}
                className={`btn ${activeGroup === g ? 'btn-light text-dark' : 'btn-outline-light'} px-3 py-2 d-flex align-items-center gap-2`}
                style={{ border: borderStyle, minHeight: '44px' }}
              >
                <span 
                  style={{ 
                    display: 'inline-block', 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%', 
                    backgroundColor: indicatorColor 
                  }} 
                />
                Grupo {g}
              </button>
            );
          })}
        </div>
      </div>

      <div className="row g-4">
        {/* Matches Input List */}
        <div className="col-12 col-lg-7">
          <section className="card match-picker-card p-3 p-md-4">
            <div className="d-flex align-items-center justify-content-between border-bottom border-light-subtle pb-3 mb-3">
              <h3 className="h4 text-white mb-0">Jogos do Grupo {activeGroup}</h3>
              <span className={`badge rounded-pill ${groupStats[activeGroup].badgeClass} px-3 py-2`}>
                {groupStats[activeGroup].label}
              </span>
            </div>

            <div className="d-flex flex-column gap-3">
              {currentGroupMatches.map((m, idx) => (
                <div key={m.matchId} className="match-card-vs p-3">
                  {/* Team A Info */}
                  <div className="match-card-team">
                    <div className="match-card-escudo-wrapper" style={{ width: '56px', height: '56px' }}>
                      <img 
                        src={`/${m.bandeiraA || m.escudoA}`}
                        className="match-card-escudo" 
                        alt={m.selecaoA} 
                        loading="lazy"
                        decoding="async"
                        onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                      />
                    </div>
                    <span className="match-card-team-name text-white font-weight-bold" style={{ fontSize: '0.88rem' }}>
                      {m.selecaoA}
                    </span>
                  </div>

                  {/* Inputs */}
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      className="score-number-input"
                      value={m.placarA}
                      onChange={(e) => onScoreChange(activeGroup, m.matchId, 'placarA', e.target.value)}
                      placeholder="-"
                      aria-label={`Gols do ${m.selecaoA}`}
                    />
                    <span className="score-divider">x</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      className="score-number-input"
                      value={m.placarB}
                      onChange={(e) => onScoreChange(activeGroup, m.matchId, 'placarB', e.target.value)}
                      placeholder="-"
                      aria-label={`Gols do ${m.selecaoB}`}
                    />
                  </div>

                  {/* Team B Info */}
                  <div className="match-card-team">
                    <div className="match-card-escudo-wrapper" style={{ width: '56px', height: '56px' }}>
                      <img 
                        src={`/${m.bandeiraB || m.escudoB}`}
                        className="match-card-escudo" 
                        alt={m.selecaoB} 
                        loading="lazy"
                        decoding="async"
                        onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                      />
                    </div>
                    <span className="match-card-team-name text-white font-weight-bold" style={{ fontSize: '0.88rem' }}>
                      {m.selecaoB}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation inside group stage */}
            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top border-light-subtle">
              <button
                onClick={handlePrevGroup}
                className="btn btn-outline-light"
                disabled={activeGroup === "A"}
              >
                &lsaquo; Anterior
              </button>
              <button
                onClick={handleNextGroup}
                className="btn btn-outline-light"
                disabled={activeGroup === "L"}
              >
                Próximo &rsaquo;
              </button>
            </div>
          </section>
        </div>

        {/* Dynamic Standings Table */}
        <div className="col-12 col-lg-5">
          <GroupStandings 
            grupoLetter={activeGroup}
            standings={currentGroupStandings}
            onSwapTeams={onSwapTeams}
          />
        </div>
      </div>

      {/* Advance Action Button */}
      {isAllGroupsFinished && (
        <div className="text-center mt-5 mb-4 animate-pulse">
          <button
            onClick={onNextStep}
            className="btn btn-primary btn-lg px-5 py-3 btn-pulse"
            style={{ 
              background: 'linear-gradient(135deg, #00C853, #FFD166)', 
              color: '#061A12',
              fontSize: '1.2rem',
              fontWeight: 800
            }}
          >
            🏁 Ir para Classificados do Mata-mata
          </button>
        </div>
      )}
    </div>
  );
}
