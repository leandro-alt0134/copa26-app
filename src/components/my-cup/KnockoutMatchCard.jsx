import React from 'react';

export default function KnockoutMatchCard({
  match = {},
  stageId,
  onMatchChange
}) {
  const { id, jogo, selecaoA, selecaoB, placarA, placarB, vencedor, decisao, escudoA, escudoB, bandeiraA, bandeiraB } = match;

  const scoreA = placarA !== "" ? parseInt(placarA) : NaN;
  const scoreB = placarB !== "" ? parseInt(placarB) : NaN;

  const isTied = !isNaN(scoreA) && !isNaN(scoreB) && scoreA === scoreB;
  const hasScores = !isNaN(scoreA) && !isNaN(scoreB);

  const handleScoreChange = (field, val) => {
    onMatchChange(stageId, id, field, val);
  };

  const handleSelectWinner = (teamName) => {
    onMatchChange(stageId, id, 'vencedor_override', teamName);
  };

  const isWinnerA = vencedor === selecaoA;
  const isWinnerB = vencedor === selecaoB;

  const isTbdA = selecaoA === "TBD" || !selecaoA;
  const isTbdB = selecaoB === "TBD" || !selecaoB;

  return (
    <article 
      className="match p-3" 
      style={{ 
        border: vencedor ? '1px solid rgba(0, 200, 83, 0.35)' : '1px solid rgba(255, 255, 255, 0.12)',
        background: vencedor ? 'rgba(0, 200, 83, 0.04)' : 'rgba(255, 255, 255, 0.05)',
        borderRadius: '20px',
        transition: 'all 0.2s ease'
      }}
    >
      <div className="match-label d-flex justify-content-between align-items-center mb-2">
        <span>⚽ {jogo}</span>
        {decisao === "prorrogacao_penaltis" && vencedor && (
          <span className="badge text-bg-warning" style={{ fontSize: '0.62rem' }}>Pênaltis</span>
        )}
      </div>

      <div className="d-flex flex-column gap-2">
        {/* Team A Row */}
        <div 
          className="match-team d-flex align-items-center justify-content-between p-2 rounded"
          style={{ 
            background: isWinnerA ? 'rgba(0, 200, 83, 0.16)' : 'rgba(0, 0, 0, 0.22)',
            border: isWinnerA ? '1px solid rgba(0, 200, 83, 0.4)' : '1px solid transparent'
          }}
        >
          <div className="d-flex align-items-center gap-2">
            {!isTbdA && (
              <img 
                src={`/${bandeiraA || escudoA}`} 
                className="team-mini" 
                style={{ width: '20px', height: '20px' }} 
                alt="" 
              />
            )}
            <span className={`font-weight-bold text-white small ${isWinnerA ? 'text-primary' : ''}`}>
              {selecaoA}
            </span>
            {isWinnerA && <span className="text-success ms-1">✓</span>}
          </div>

          <input
            type="number"
            min="0"
            step="1"
            className="score-number-input p-0"
            style={{ width: '42px', height: '36px', fontSize: '1.1rem', borderRadius: '8px' }}
            disabled={isTbdA || isTbdB}
            value={placarA}
            onChange={(e) => handleScoreChange('placarA', e.target.value)}
            placeholder="-"
          />
        </div>

        {/* Team B Row */}
        <div 
          className="match-team d-flex align-items-center justify-content-between p-2 rounded"
          style={{ 
            background: isWinnerB ? 'rgba(0, 200, 83, 0.16)' : 'rgba(0, 0, 0, 0.22)',
            border: isWinnerB ? '1px solid rgba(0, 200, 83, 0.4)' : '1px solid transparent'
          }}
        >
          <div className="d-flex align-items-center gap-2">
            {!isTbdB && (
              <img 
                src={`/${bandeiraB || escudoB}`} 
                className="team-mini" 
                style={{ width: '20px', height: '20px' }} 
                alt="" 
              />
            )}
            <span className={`font-weight-bold text-white small ${isWinnerB ? 'text-primary' : ''}`}>
              {selecaoB}
            </span>
            {isWinnerB && <span className="text-success ms-1">✓</span>}
          </div>

          <input
            type="number"
            min="0"
            step="1"
            className="score-number-input p-0"
            style={{ width: '42px', height: '36px', fontSize: '1.1rem', borderRadius: '8px' }}
            disabled={isTbdA || isTbdB}
            value={placarB}
            onChange={(e) => handleScoreChange('placarB', e.target.value)}
            placeholder="-"
          />
        </div>
      </div>

      {/* Penalty shootout tie breaker selector */}
      {hasScores && isTied && !isTbdA && !isTbdB && (
        <div className="mt-3 p-2 rounded text-center animate-fade-in" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px dashed rgba(255, 255, 255, 0.15)' }}>
          <p className="small text-muted mb-2 font-weight-bold" style={{ fontSize: '0.78rem' }}>
            Quem avança nos Pênaltis / Prorrogação?
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <button
              type="button"
              className={`btn btn-sm px-3 ${isWinnerA ? 'btn-success text-white' : 'btn-outline-light'}`}
              style={{ fontSize: '0.75rem', fontWeight: 700 }}
              onClick={() => handleSelectWinner(selecaoA)}
            >
              {selecaoA}
            </button>
            <button
              type="button"
              className={`btn btn-sm px-3 ${isWinnerB ? 'btn-success text-white' : 'btn-outline-light'}`}
              style={{ fontSize: '0.75rem', fontWeight: 700 }}
              onClick={() => handleSelectWinner(selecaoB)}
            >
              {selecaoB}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
