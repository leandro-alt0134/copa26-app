import React from 'react';
import { checkTechnicalTie, hasTechnicalTie } from '../../utils/myCupStandings';

export default function QualifiedTeams({
  qualifiedTeams = { firstPlaces: [], secondPlaces: [], bestThirdPlaces: [] },
  allThirdPlaces = [], // array of all 12 third places sorted
  onSwapThirds,
  onNextStep
}) {
  const showTieWarning = hasTechnicalTie(allThirdPlaces);

  return (
    <div className="qualified-teams-container animate-fade-in">
      <section className="hero mb-4 py-4 px-4 text-center">
        <span className="hero-badge mb-2">📊 Transição de Fase</span>
        <h2 className="titulo text-white mb-2">Classificados para o Mata-mata</h2>
        <p className="small text-muted-old mx-auto mb-0" style={{ maxWidth: '600px' }}>
          Definimos as 32 seleções que disputarão as eliminatórias: 12 campeãs de grupo, 
          12 vice-campeãs e as 8 melhores terceiras colocadas.
        </p>
      </section>

      {showTieWarning && (
        <div 
          className="alert alert-warning py-3 px-4 mb-4 d-flex align-items-center gap-3"
          style={{ border: '1px solid rgba(255, 209, 102, 0.3)', background: 'rgba(255, 209, 102, 0.08)' }}
        >
          <span style={{ fontSize: '1.4rem' }}>⚠️</span>
          <div>
            <strong className="text-warning-emphasis d-block mb-1">Empate técnico detectado entre terceiros!</strong>
            <span className="text-muted small">
              Ajuste a ordem relativa dos terceiros colocados usando as setas para decidir quem fica com a vaga no mata-mata.
            </span>
          </div>
        </div>
      )}

      <div className="row g-4">
        {/* Firsts and Seconds Column */}
        <div className="col-12 col-md-6 col-lg-5 d-flex flex-column gap-4">
          {/* First Places */}
          <article className="card match-picker-card p-3 p-md-4">
            <h3 className="h5 text-white mb-3 border-bottom border-light-subtle pb-2">
              🥇 Primeiros Colocados
            </h3>
            <div className="row g-2">
              {qualifiedTeams.firstPlaces.map((team, idx) => (
                <div key={team.nome} className="col-6">
                  <div className="d-flex align-items-center gap-2 p-2 rounded" style={{ background: 'rgba(0, 200, 83, 0.08)', border: '1px solid rgba(0, 200, 83, 0.15)' }}>
                    <img 
                      src={`/${team.bandeira || team.escudo}`} 
                      className="team-mini" 
                      style={{ width: '22px', height: '22px' }} 
                      alt="" 
                    />
                    <span className="text-white font-weight-bold small truncate" title={team.nome}>
                      {String.fromCharCode(65 + idx)}. {team.nome}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* Second Places */}
          <article className="card match-picker-card p-3 p-md-4">
            <h3 className="h5 text-white mb-3 border-bottom border-light-subtle pb-2">
              🥈 Segundos Colocados
            </h3>
            <div className="row g-2">
              {qualifiedTeams.secondPlaces.map((team, idx) => (
                <div key={team.nome} className="col-6">
                  <div className="d-flex align-items-center gap-2 p-2 rounded" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <img 
                      src={`/${team.bandeira || team.escudo}`} 
                      className="team-mini" 
                      style={{ width: '22px', height: '22px' }} 
                      alt="" 
                    />
                    <span className="text-white font-weight-bold small truncate" title={team.nome}>
                      {String.fromCharCode(65 + idx)}. {team.nome}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        {/* Third Places Ranking Column */}
        <div className="col-12 col-md-6 col-lg-7">
          <article className="card match-picker-card p-3 p-md-4 h-100">
            <h3 className="h5 text-white mb-1 border-bottom border-light-subtle pb-2">
              🥉 Ranking de Terceiros Colocados
            </h3>
            <p className="small text-muted-old mb-3">
              Apenas as 8 melhores seleções avançam para a fase eliminatória.
            </p>

            <div className="table-responsive">
              <table className="table table-dark table-borderless align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
                <thead>
                  <tr className="text-muted uppercase small" style={{ borderBottom: '1px solid var(--line)', fontSize: '0.74rem', fontWeight: 800 }}>
                    <th style={{ width: '40px' }} className="text-center">#</th>
                    <th>Seleção</th>
                    <th className="text-center" style={{ width: '50px' }}>Pts</th>
                    <th className="text-center" style={{ width: '50px' }}>SG</th>
                    <th className="text-center" style={{ width: '50px' }}>GP</th>
                    <th className="text-center" style={{ width: '80px' }}>Status</th>
                    {showTieWarning && <th className="text-center" style={{ width: '70px' }}>Ajustar</th>}
                  </tr>
                </thead>
                <tbody>
                  {allThirdPlaces.map((team, idx) => {
                    const isQualified = idx < 8;
                    const canGoUp = idx > 0 && checkTechnicalTie(team, allThirdPlaces[idx - 1]);
                    const canGoDown = idx < allThirdPlaces.length - 1 && checkTechnicalTie(team, allThirdPlaces[idx + 1]);

                    return (
                      <tr 
                        key={team.nome} 
                        style={{ 
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          opacity: isQualified ? 1 : 0.45 
                        }}
                      >
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
                        <td className="text-center text-muted">
                          {team.saldo > 0 ? `+${team.saldo}` : team.saldo}
                        </td>
                        <td className="text-center text-muted">{team.golsPro}</td>
                        <td className="text-center">
                          {isQualified ? (
                            <span className="badge text-bg-success px-2 py-1" style={{ fontSize: '0.68rem' }}>
                              CLASSIFICADO
                            </span>
                          ) : (
                            <span className="badge text-bg-secondary px-2 py-1" style={{ fontSize: '0.68rem' }}>
                              ELIMINADO
                            </span>
                          )}
                        </td>
                        {showTieWarning && (
                          <td className="text-center">
                            <div className="d-flex gap-1 justify-content-center">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-light p-1 d-flex align-items-center justify-content-center"
                                style={{ width: '22px', height: '22px', fontSize: '0.65rem', opacity: canGoUp ? 1 : 0.25 }}
                                disabled={!canGoUp}
                                onClick={() => onSwapThirds(idx, idx - 1)}
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-light p-1 d-flex align-items-center justify-content-center"
                                style={{ width: '22px', height: '22px', fontSize: '0.65rem', opacity: canGoDown ? 1 : 0.25 }}
                                disabled={!canGoDown}
                                onClick={() => onSwapThirds(idx, idx + 1)}
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
          </article>
        </div>
      </div>

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
          ⚔️ Gerar Chaveamento do Mata-mata
        </button>
      </div>
    </div>
  );
}
