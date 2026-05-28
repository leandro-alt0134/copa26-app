import React from 'react';

export default function MatchPicker({ partidas, partidaId, setPartidaId, loading, partidaAtual }) {
  return (
    <section className="match-picker-card p-3 p-md-4 mb-4" id="match-picker-container">
      <h2 className="h5 text-white mb-3 text-center">Escolha um confronto da Fase de Grupos</h2>
      <div className="row">
        <div className="col-12 col-md-8 col-lg-6 mx-auto text-center">
          <select
            id="seletor-partida"
            className="form-select w-100 mb-3"
            aria-label="Escolher confronto"
            value={partidaId}
            onChange={(e) => setPartidaId(e.target.value)}
          >
            <option value="" disabled>Escolha uma partida...</option>
            {loading ? (
              <option disabled>Carregando partidas...</option>
            ) : (
              partidas.map((partida) => (
                <option key={partida.id} value={partida.id}>
                  Grupo {partida.grupo} — Rodada {partida.rodada} — {partida.selecaoA} x {partida.selecaoB}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Card Detalhado do Confronto */}
      {partidaAtual && (
        <div id="secao-confronto-detalhe" className="mt-3">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
              <div className="match-card-vs" id="match-card-vs-element">
                {/* Seleção A */}
                <div className="match-card-team">
                  <div className="match-card-escudo-wrapper">
                    <img
                      src={`/${partidaAtual.escudoA}`}
                      alt={`Escudo de ${partidaAtual.selecaoA}`}
                      className="match-card-escudo"
                      onError={(e) => { e.currentTarget.src = '/assets/copa-2026-logo-white.svg'; }}
                    />
                  </div>
                  <h3 className="match-card-team-name">{partidaAtual.selecaoA}</h3>
                </div>

                {/* Meio */}
                <div className="match-card-center-vs">
                  <span className="match-card-badge">Grupo {partidaAtual.grupo} — Rodada {partidaAtual.rodada}</span>
                  <span className="match-card-vs-text">VS</span>
                </div>

                {/* Seleção B */}
                <div className="match-card-team">
                  <div className="match-card-escudo-wrapper">
                    <img
                      src={`/${partidaAtual.escudoB}`}
                      alt={`Escudo de ${partidaAtual.selecaoB}`}
                      className="match-card-escudo"
                      onError={(e) => { e.currentTarget.src = '/assets/copa-2026-logo-white.svg'; }}
                    />
                  </div>
                  <h3 className="match-card-team-name">{partidaAtual.selecaoB}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
