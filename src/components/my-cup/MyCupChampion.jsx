import React from 'react';
import MyCupShare from './MyCupShare';
import MyCupAchievements from './MyCupAchievements';

export default function MyCupChampion({
  myCupData = {},
  selecoes = [],
  onReset
}) {
  const { champion, runnerUp, thirdPlace, profile, knockout = {}, groupPredictions = {} } = myCupData;

  // 1. Resolve Champion details (flag/shield)
  const champObj = selecoes.find((s) => s.nome.toLowerCase() === champion?.toLowerCase()) || {};
  const champFlag = champObj.bandeira || champObj.escudo || '';
  const champEscudo = champObj.escudo || '';

  // 2. Calculate Stats
  // A. Total Goals Projected
  let totalGoals = 0;
  let highestScoringMatch = null;
  let highestScoreSum = -1;

  const processMatchStats = (m, stageName) => {
    if (m && m.placarA !== "" && m.placarB !== "") {
      const gA = parseInt(m.placarA);
      const gB = parseInt(m.placarB);
      if (!isNaN(gA) && !isNaN(gB)) {
        const sum = gA + gB;
        totalGoals += sum;
        if (sum > highestScoreSum) {
          highestScoreSum = sum;
          highestScoringMatch = {
            selecaoA: m.selecaoA,
            selecaoB: m.selecaoB,
            placarA: gA,
            placarB: gB,
            stage: stageName,
            sum
          };
        }
      }
    }
  };

  // Group stage matches
  Object.keys(groupPredictions).forEach((gLetter) => {
    const groupData = groupPredictions[gLetter] || {};
    const matches = groupData.matches || [];
    matches.forEach((m) => processMatchStats(m, `Grupo ${gLetter}`));
  });

  // Knockout stage matches
  const knockoutRounds = [
    { key: 'roundOf32', name: '16-avos' },
    { key: 'roundOf16', name: 'Oitavas' },
    { key: 'quarterFinals', name: 'Quartas' },
    { key: 'semiFinals', name: 'Semifinal' }
  ];

  knockoutRounds.forEach((round) => {
    const matches = knockout[round.key] || [];
    matches.forEach((m) => processMatchStats(m, round.name));
  });

  if (knockout.thirdPlace) processMatchStats(knockout.thirdPlace, 'Disputa 3º Lugar');
  if (knockout.final) processMatchStats(knockout.final, 'Grande Final');

  // B. Best group stage campaign team
  let bestGroupTeam = null;
  let bestStats = { pontos: -1, saldo: -999, golsPro: -1, vitorias: -1 };

  Object.values(groupPredictions).forEach((gData) => {
    const standings = gData.standings || [];
    standings.forEach((team) => {
      // Compare
      let isBetter = false;
      if (team.pontos > bestStats.pontos) isBetter = true;
      else if (team.pontos === bestStats.pontos) {
        if (team.saldo > bestStats.saldo) isBetter = true;
        else if (team.saldo === bestStats.saldo) {
          if (team.golsPro > bestStats.golsPro) isBetter = true;
          else if (team.golsPro === bestStats.golsPro) {
            if (team.vitorias > bestStats.vitorias) isBetter = true;
          }
        }
      }

      if (isBetter) {
        bestGroupTeam = team;
        bestStats = {
          pontos: team.pontos,
          saldo: team.saldo,
          golsPro: team.golsPro,
          vitorias: team.vitorias
        };
      }
    });
  });

  // C. Path of the champion (Caminho do campeão)
  const championPath = [];
  const roundsToCheck = [
    { key: 'roundOf32', name: '32-avos' },
    { key: 'roundOf16', name: 'Oitavas' },
    { key: 'quarterFinals', name: 'Quartas' },
    { key: 'semiFinals', name: 'Semifinal' },
    { key: 'final', name: 'Grande Final', isSingle: true }
  ];

  roundsToCheck.forEach((round) => {
    if (round.isSingle) {
      const m = knockout.final;
      if (m && (m.selecaoA === champion || m.selecaoB === champion)) {
        championPath.push({ stageName: round.name, match: m });
      }
    } else {
      const matches = knockout[round.key] || [];
      const m = matches.find((match) => match.selecaoA === champion || match.selecaoB === champion);
      if (m) {
        championPath.push({ stageName: round.name, match: m });
      }
    }
  });

  return (
    <div className="my-cup-champion-container animate-fade-in pb-5">
      {/* Decorative Celebration Header */}
      <section className="hero mb-4 py-5 px-4 text-center position-relative overflow-hidden" style={{ border: '1px solid var(--accent)' }}>
        {/* Simple inline confeti background decoration */}
        <div className="position-absolute inset-0 pointer-events-none opacity-20" style={{ fontSize: '1.5rem', userSelect: 'none' }}>
          ✨ 🎉 ⚽ 🏆 🌟 🇧🇷 🇫🇷 🇦🇷 🇩🇪 🎊 ✨ 🎉 ⚽ 🏆 🌟
        </div>

        <span className="hero-badge mb-3" style={{ background: 'rgba(255, 209, 102, 0.25)', color: '#fff9d2', borderColor: 'var(--accent)' }}>
          🏆 Projeção Finalizada!
        </span>
        
        <div className="d-flex align-items-center justify-content-center gap-3 mb-3 flex-wrap">
          {champEscudo && (
            <img 
              src={`/${champEscudo}`} 
              className="hero-logo match-card-escudo animate-pulse" 
              style={{ width: '100px', height: '100px', objectFit: 'contain' }}
              alt="" 
            />
          )}
          <h1 className="my-2" style={{ textShadow: '0 4px 20px rgba(255,209,102,0.4)', fontSize: 'clamp(2.2rem, 8vw, 4.5rem)' }}>
            {champion}
          </h1>
        </div>

        <p className="lead text-white font-weight-bold mx-auto mb-4" style={{ maxWidth: '650px' }}>
          é o campeão da sua Copa do Mundo dos Palpites 2026!
        </p>

        <div className="d-flex justify-content-center gap-3">
          <button
            onClick={onReset}
            className="btn btn-outline-light"
            style={{ borderRadius: '12px', minHeight: '44px' }}
          >
            🔄 Simular Novamente
          </button>
        </div>
      </section>

      {/* Profile Card and Sharing Section */}
      <div className="row g-4 mb-4">
        {/* Prediction Profile */}
        <div className="col-12 col-lg-6">
          <article className="card match-picker-card p-4 h-100">
            <h3 className="h5 text-white mb-3 border-bottom border-light-subtle pb-2">
              🌀 Perfil da Sua Projeção
            </h3>
            {profile ? (
              <div className="profile-card m-0" style={{ borderLeft: '4px solid var(--accent)' }}>
                <span className="profile-icon">🎭</span>
                <div className="profile-info">
                  <span className="profile-title-label">Classificação da Copa</span>
                  <h4 className="profile-name">{profile.nome}</h4>
                  <p className="profile-desc">{profile.descricao}</p>
                </div>
              </div>
            ) : (
              <div className="empty-state text-center text-muted">Nenhum perfil calculado.</div>
            )}
          </article>
        </div>

        {/* Share Actions */}
        <div className="col-12 col-lg-6">
          <MyCupShare 
            myCupData={myCupData}
            selecoes={selecoes}
          />
        </div>
      </div>

      {/* Stats and Champions Path */}
      <div className="row g-4 mb-4">
        {/* Champions Path */}
        <div className="col-12 col-lg-7">
          <article className="card match-picker-card p-3 p-md-4 h-100">
            <h3 className="h5 text-white mb-3 border-bottom border-light-subtle pb-2">
              🛣️ Caminho do Campeão no Mata-mata
            </h3>
            <div className="d-flex flex-column gap-3">
              {championPath.map((item, idx) => {
                const m = item.match;
                const scoreA = m.placarA;
                const scoreB = m.placarB;
                const opp = m.selecaoA === champion ? m.selecaoB : m.selecaoA;
                const oppFlag = m.selecaoA === champion ? m.bandeiraB || m.escudoB : m.bandeiraA || m.escudoA;
                const champScore = m.selecaoA === champion ? scoreA : scoreB;
                const oppScore = m.selecaoA === champion ? scoreB : scoreA;
                
                const isPenalty = m.decisao === "prorrogacao_penaltis";

                return (
                  <div 
                    key={item.stageName} 
                    className="d-flex align-items-center justify-content-between p-3 rounded"
                    style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div>
                      <span className="badge text-bg-secondary small mb-1">{item.stageName}</span>
                      <div className="d-flex align-items-center gap-2">
                        <img src={`/${oppFlag}`} alt="" className="team-mini" style={{ width: '18px', height: '18px' }} />
                        <span className="text-white small font-weight-bold">vs {opp}</span>
                      </div>
                    </div>
                    
                    <div className="text-end">
                      <span className="font-weight-bold text-white h5 mb-0">
                        {champScore} - {oppScore}
                      </span>
                      {isPenalty && (
                        <span className="d-block small text-warning font-weight-bold" style={{ fontSize: '0.65rem' }}>
                          Pênaltis
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        </div>

        {/* Projections Stats Summary */}
        <div className="col-12 col-lg-5">
          <article className="card match-picker-card p-3 p-md-4 h-100">
            <h3 className="h5 text-white mb-3 border-bottom border-light-subtle pb-2">
              📊 Estatísticas da Copa
            </h3>
            
            <div className="d-flex flex-column gap-3">
              {/* Total Goals */}
              <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-light-subtle">
                <span className="text-muted small">Gols Projetados:</span>
                <span className="font-weight-bold text-white h5 mb-0">{totalGoals} gols</span>
              </div>

              {/* Average goals */}
              <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-light-subtle">
                <span className="text-muted small">Média de Gols:</span>
                <span className="font-weight-bold text-white h5 mb-0">
                  {(totalGoals / 80).toFixed(2)} /jogo
                </span>
              </div>

              {/* Best group-stage team */}
              {bestGroupTeam && (
                <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-light-subtle">
                  <span className="text-muted small">Melhor na Fase de Grupos:</span>
                  <div className="d-flex align-items-center gap-2">
                    <img 
                      src={`/${bestGroupTeam.bandeira || bestGroupTeam.escudo}`} 
                      alt="" 
                      className="team-mini" 
                      style={{ width: '18px', height: '18px' }} 
                    />
                    <span className="font-weight-bold text-success small">
                      {bestGroupTeam.nome} ({bestGroupTeam.pontos} pts)
                    </span>
                  </div>
                </div>
              )}

              {/* Highest scoring game */}
              {highestScoringMatch && (
                <div className="py-2">
                  <span className="text-muted small d-block mb-1">Jogo com Maior Placar:</span>
                  <div className="p-3 rounded text-center" style={{ background: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="badge text-bg-warning small mb-1">{highestScoringMatch.stage}</span>
                    <p className="font-weight-bold text-white mb-0 small">
                      {highestScoringMatch.selecaoA} {highestScoringMatch.placarA} x {highestScoringMatch.placarB} {highestScoringMatch.selecaoB}
                    </p>
                    <span className="text-muted small">({highestScoringMatch.sum} gols no total)</span>
                  </div>
                </div>
              )}
            </div>
          </article>
        </div>
      </div>

      {/* Achievements Unlocked Section */}
      <section className="card match-picker-card p-3 p-md-4">
        <MyCupAchievements 
          myCupData={myCupData}
          selecoes={selecoes}
        />
      </section>
    </div>
  );
}
