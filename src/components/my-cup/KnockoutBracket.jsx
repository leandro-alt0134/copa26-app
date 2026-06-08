import React, { useState, useEffect } from 'react';
import KnockoutMatchCard from './KnockoutMatchCard';

const ROUNDS = [
  { id: 'roundOf32', label: '16-avos', title: 'Fase de 32-avos' },
  { id: 'roundOf16', label: 'Oitavas', title: 'Oitavas de Final' },
  { id: 'quarterFinals', label: 'Quartas', title: 'Quartas de Final' },
  { id: 'semiFinals', label: 'Semifinais', title: 'Semifinais' },
  { id: 'finals', label: 'Finais', title: 'Finais & Decisão' }
];

export default function KnockoutBracket({
  knockout = {},
  onKnockoutMatchChange,
  onGenerateNextStage,
  onFinishCup
}) {
  const [activeRoundId, setActiveRoundId] = useState('roundOf32');

  const activeRoundIdx = ROUNDS.findIndex((r) => r.id === activeRoundId);
  const activeRound = ROUNDS[activeRoundIdx];

  // Resolve matches for the active round
  let roundMatches = [];
  if (activeRoundId === 'finals') {
    if (knockout.thirdPlace) roundMatches.push(knockout.thirdPlace);
    if (knockout.final) roundMatches.push(knockout.final);
  } else {
    roundMatches = knockout[activeRoundId] || [];
  }

  // Check if current round matches are all filled
  const isRoundComplete = roundMatches.length > 0 && roundMatches.every(
    (m) => m && m.placarA !== "" && m.placarB !== "" && m.vencedor !== null
  );

  // Check if subsequent rounds exist (to show next stage generation button)
  const isLastRound = activeRoundId === 'finals';
  
  // Find what the furthest unlocked round is
  const getFurthestUnlockedRound = () => {
    if (knockout.final && knockout.final.vencedor) return 'finals';
    if (knockout.semiFinals && knockout.semiFinals.length > 0) return 'semiFinals';
    if (knockout.quarterFinals && knockout.quarterFinals.length > 0) return 'quarterFinals';
    if (knockout.roundOf16 && knockout.roundOf16.length > 0) return 'roundOf16';
    return 'roundOf32';
  };

  const furthestRoundId = getFurthestUnlockedRound();
  const furthestRoundIdx = ROUNDS.findIndex((r) => r.id === furthestRoundId);

  // Auto-focus round when data updates
  useEffect(() => {
    setActiveRoundId(furthestRoundId);
  }, [furthestRoundId]);

  const handlePrevRound = () => {
    if (activeRoundIdx > 0) {
      setActiveRoundId(ROUNDS[activeRoundIdx - 1].id);
    }
  };

  const handleNextRound = () => {
    if (activeRoundIdx < furthestRoundIdx) {
      setActiveRoundId(ROUNDS[activeRoundIdx + 1].id);
    }
  };

  const gridClass = roundMatches.length > 2 ? 'grid-2col' : '';

  return (
    <div className="knockout-bracket-container animate-fade-in">
      {/* Notice Disclaimer (discrete) */}
      <div className="notice mb-4 py-2 px-3 small text-center opacity-75" style={{ fontSize: '0.8rem' }}>
        “Chaveamento simulado para fins de entretenimento e projeção.”
      </div>

      {/* Carousel Navigation Controls */}
      <div className="bracket-carousel-controls d-flex align-items-center justify-content-between mb-4 p-2">
        <button
          type="button"
          className="btn btn-outline-light btn-carousel-nav"
          onClick={handlePrevRound}
          disabled={activeRoundIdx === 0}
          aria-label="Rodada anterior"
        >
          &lsaquo; <span className="d-none d-sm-inline ms-1">Anterior</span>
        </button>

        <div className="bracket-carousel-indicators d-flex gap-1 gap-md-2">
          {ROUNDS.map((round, idx) => {
            const isUnlocked = idx <= furthestRoundIdx;
            const isActive = round.id === activeRoundId;

            return (
              <button
                key={round.id}
                type="button"
                className={`indicator-pill ${isActive ? 'active' : ''}`}
                style={{ 
                  opacity: isUnlocked ? 1 : 0.35, 
                  cursor: isUnlocked ? 'pointer' : 'not-allowed' 
                }}
                disabled={!isUnlocked}
                onClick={() => setActiveRoundId(round.id)}
              >
                {round.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="btn btn-outline-light btn-carousel-nav"
          onClick={handleNextRound}
          disabled={activeRoundIdx >= furthestRoundIdx}
          aria-label="Próxima rodada"
        >
          <span className="d-none d-sm-inline me-1">Próxima</span> &rsaquo;
        </button>
      </div>

      {/* Brackets Content Card */}
      <section className="card match-picker-card p-3 p-md-4 mb-4">
        <h2 className="bracket-stage-title h4 text-center pb-2 mb-4 border-bottom border-light-subtle text-white">
          {activeRound.title}
        </h2>

        {roundMatches.length === 0 ? (
          <div className="empty-state py-5 text-center text-muted">
            ❌ Seleções ainda não classificadas para esta fase. Preencha a fase anterior para gerar o chaveamento.
          </div>
        ) : (
          <div className={`matches-list ${gridClass}`}>
            {roundMatches.map((match) => (
              <KnockoutMatchCard
                key={match.id}
                match={match}
                stageId={activeRoundId}
                onMatchChange={onKnockoutMatchChange}
              />
            ))}
          </div>
        )}
      </section>

      {/* Next Step Action Button */}
      {isRoundComplete && (
        <div className="text-center mt-4 mb-5 animate-pulse">
          {!isLastRound ? (
            <button
              onClick={() => onGenerateNextStage(activeRoundId)}
              className="btn btn-primary btn-lg px-5 py-3 btn-pulse"
              style={{
                background: 'linear-gradient(135deg, #00C853, #38BDF8)',
                color: '#061A12',
                fontWeight: 800,
                fontSize: '1.15rem'
              }}
            >
              ⏩ Gerar Próxima Fase ({ROUNDS[activeRoundIdx + 1].label})
            </button>
          ) : (
            <button
              onClick={onFinishCup}
              className="btn btn-primary btn-lg px-5 py-3 btn-pulse"
              style={{
                background: 'linear-gradient(135deg, #FFD166, #00C853)',
                color: '#061A12',
                fontWeight: 900,
                fontSize: '1.25rem'
              }}
            >
              🏆 Coroar Campeão da Minha Copa!
            </button>
          )}
        </div>
      )}
    </div>
  );
}
