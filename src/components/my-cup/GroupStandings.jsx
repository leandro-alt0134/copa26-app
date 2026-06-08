import React from 'react';
import { checkTechnicalTie, hasTechnicalTie } from '../../utils/myCupStandings';

export default function GroupStandings({
  grupoLetter,
  standings = [],
  onSwapTeams
}) {
  const showTieWarning = hasTechnicalTie(standings);

  return (
    <article className="card match-picker-card p-3 p-md-4 h-100">
      <div className="border-bottom border-light-subtle pb-3 mb-3">
        <h3 className="h4 text-white mb-1">Classificação Grupo {grupoLetter}</h3>
        <span className="small text-muted-old">Calculada em tempo real</span>
      </div>

      {showTieWarning && (
        <div 
          className="alert alert-warning py-2 px-3 mb-3 small d-flex align-items-center gap-2"
          style={{ border: '1px solid rgba(255, 209, 102, 0.3)', background: 'rgba(255, 209, 102, 0.08)' }}
        >
          <span>⚠️</span>
          <span className="text-warning-emphasis font-weight-bold">
            Empate técnico detectado. Ajuste a ordem usando as setas.
          </span>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="d-none d-md-block table-responsive">
        <table className="table table-dark table-borderless align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
          <thead>
            <tr className="text-muted uppercase small" style={{ borderBottom: '1px solid var(--line)', fontSize: '0.74rem', fontWeight: 800 }}>
              <th style={{ width: '40px' }} className="text-center">#</th>
              <th>Seleção</th>
              <th className="text-center" style={{ width: '50px' }}>Pts</th>
              <th className="text-center" style={{ width: '40px' }}>J</th>
              <th className="text-center" style={{ width: '40px' }}>V</th>
              <th className="text-center" style={{ width: '45px' }}>GP</th>
              <th className="text-center" style={{ width: '45px' }}>GC</th>
              <th className="text-center" style={{ width: '50px' }}>SG</th>
              {showTieWarning && <th className="text-center" style={{ width: '70px' }}>Ajustar</th>}
            </tr>
          </thead>
          <tbody>
            {standings.map((team, idx) => {
              const canGoUp = idx > 0 && checkTechnicalTie(team, standings[idx - 1]);
              const canGoDown = idx < standings.length - 1 && checkTechnicalTie(team, standings[idx + 1]);

              return (
                <tr key={team.nome} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td className="text-center font-weight-bold text-muted">{idx + 1}º</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img 
                        src={`/${team.bandeira || team.escudo}`} 
                        alt="" 
                        className="team-mini" 
                        loading="lazy" 
                        decoding="async" 
                      />
                      <span className="text-white font-weight-bold">{team.nome}</span>
                    </div>
                  </td>
                  <td className="text-center font-weight-bold text-white">{team.pontos}</td>
                  <td className="text-center text-muted">{team.jogos}</td>
                  <td className="text-center text-muted">{team.vitorias}</td>
                  <td className="text-center text-muted">{team.golsPro}</td>
                  <td className="text-center text-muted">{team.golsContra}</td>
                  <td className="text-center font-weight-bold text-white">
                    {team.saldo > 0 ? `+${team.saldo}` : team.saldo}
                  </td>
                  {showTieWarning && (
                    <td className="text-center">
                      <div className="d-flex gap-1 justify-content-center">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light p-1 d-flex align-items-center justify-content-center"
                          style={{ width: '24px', height: '24px', opacity: canGoUp ? 1 : 0.25, cursor: canGoUp ? 'pointer' : 'default' }}
                          disabled={!canGoUp}
                          onClick={() => onSwapTeams(grupoLetter, idx, idx - 1)}
                          title="Mover para cima (empate técnico)"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light p-1 d-flex align-items-center justify-content-center"
                          style={{ width: '24px', height: '24px', opacity: canGoDown ? 1 : 0.25, cursor: canGoDown ? 'pointer' : 'default' }}
                          disabled={!canGoDown}
                          onClick={() => onSwapTeams(grupoLetter, idx, idx + 1)}
                          title="Mover para baixo (empate técnico)"
                        >
                          ▼
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Compact View */}
      <div className="d-block d-md-none">
        <div className="d-flex flex-column gap-2">
          {standings.map((team, idx) => {
            const canGoUp = idx > 0 && checkTechnicalTie(team, standings[idx - 1]);
            const canGoDown = idx < standings.length - 1 && checkTechnicalTie(team, standings[idx + 1]);

            return (
              <div 
                key={team.nome} 
                className="d-flex align-items-center justify-content-between p-2 rounded"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.03)', 
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <span className="font-weight-bold text-muted small" style={{ width: '24px' }}>{idx + 1}º</span>
                  <img 
                    src={`/${team.bandeira || team.escudo}`} 
                    alt="" 
                    className="team-mini" 
                    style={{ width: '20px', height: '20px' }}
                    loading="lazy" 
                    decoding="async" 
                  />
                  <span className="text-white font-weight-bold small">{team.nome}</span>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="text-end small">
                    <span className="text-white font-weight-bold">{team.pontos} pts</span>
                    <span className="text-muted mx-1">·</span>
                    <span className="text-muted">SG {team.saldo > 0 ? `+${team.saldo}` : team.saldo}</span>
                  </div>

                  {showTieWarning && (
                    <div className="d-flex gap-1">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light p-0 d-flex align-items-center justify-content-center"
                        style={{ width: '22px', height: '22px', fontSize: '0.75rem', opacity: canGoUp ? 1 : 0.25 }}
                        disabled={!canGoUp}
                        onClick={() => onSwapTeams(grupoLetter, idx, idx - 1)}
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light p-0 d-flex align-items-center justify-content-center"
                        style={{ width: '22px', height: '22px', fontSize: '0.75rem', opacity: canGoDown ? 1 : 0.25 }}
                        disabled={!canGoDown}
                        onClick={() => onSwapTeams(grupoLetter, idx, idx + 1)}
                      >
                        ▼
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}
