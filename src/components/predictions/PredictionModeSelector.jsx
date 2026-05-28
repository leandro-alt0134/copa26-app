import React from 'react';

export default function PredictionModeSelector({ setTipoPalpite }) {
  return (
    <section className="mb-4">
      <h2 className="h4 text-white mb-4 text-center font-weight-bold">Escolha o tipo de palpite</h2>
      <div className="row g-4 justify-content-center">
        {/* Card 1: Palpite Rápido */}
        <div className="col-12 col-md-6 col-lg-5">
          <article className="quiz-card mode-selector-card quick-mode text-center d-flex flex-column justify-content-between h-100 p-4">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge rounded-pill text-bg-warning px-3 py-2" style={{ color: '#061A12', fontWeight: 800 }}>
                  ⚡ 5 perguntas
                </span>
                <span className="hero-badge" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(255, 209, 102, 0.1)', color: 'var(--accent)', borderColor: 'var(--accent)' }}>
                  Intuição & Feeling
                </span>
              </div>
              <h3 className="h4 text-white font-weight-bold mb-2">Palpite Rápido</h3>
              <p className="text-white-50 small mb-3">“Para quem quer ir no feeling.”</p>
              <p className="text-muted small">Responda 5 perguntas simples e monte seu palpite sem complicação.</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="btn btn-mode w-100 py-3"
                onClick={() => setTipoPalpite('rapido')}
                style={{ borderRadius: '14px', fontSize: '0.95rem' }}
              >
                Começar no feeling
              </button>
            </div>
          </article>
        </div>

        {/* Card 2: Palpite Detalhado */}
        <div className="col-12 col-md-6 col-lg-5">
          <article className="quiz-card mode-selector-card detail-mode text-center d-flex flex-column justify-content-between h-100 p-4">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge rounded-pill text-bg-info px-3 py-2" style={{ color: '#061A12', fontWeight: 800 }}>
                  🧠 10 perguntas
                </span>
                <span className="hero-badge" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderColor: 'var(--blue)', color: 'var(--blue)', background: 'rgba(56,189,248,0.1)' }}>
                  Análise & Precisão
                </span>
              </div>
              <h3 className="h4 text-white font-weight-bold mb-2">Palpite Detalhado</h3>
              <p className="text-white-50 small mb-3">“Para quem quer analisar melhor.”</p>
              <p className="text-muted small">Responda 10 perguntas baseadas em fase, elenco, ataque, defesa, contexto e jogadores decisivos.</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="btn btn-mode w-100 py-3"
                onClick={() => setTipoPalpite('detalhado')}
                style={{ borderRadius: '14px', fontSize: '0.95rem' }}
              >
                Analisar confronto
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
