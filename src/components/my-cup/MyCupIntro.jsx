import React from 'react';

export default function MyCupIntro({
  onStartNew,
  onContinue,
  onImport,
  onImportOfficial,
  hasSavedData,
  hasIndividualPalpites,
  hasOfficialResults
}) {
  return (
    <article className="card match-picker-card p-4 p-md-5 text-center animate-fade-in">
      <div className="mb-4">
        <span className="hero-badge mb-3">🏆 Modo Campanha</span>
        <h2 className="titulo text-white mb-3">Minha Copa dos Palpites 2026</h2>
        <p className="lead text-muted-old mx-auto" style={{ maxWidth: '650px' }}>
          Faça uma projeção completa e interativa da Copa do Mundo 2026! 
          Preencha os jogos da fase de grupos, defina a classificação e simule 
          todos os confrontos de mata-mata até coroar o grande campeão.
        </p>
      </div>

      <div className="row g-3 justify-content-center my-4">
        <div className="col-12 col-sm-6 col-md-4">
          <div className="stat-card p-3 text-start h-100">
            <h3 className="h6 text-white mb-2">📊 Grupos & Tabelas</h3>
            <p className="small text-muted mb-0">
              Calcule tabelas automáticas e ajuste manualmente as ordens em empates técnicos.
            </p>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-4">
          <div className="stat-card p-3 text-start h-100">
            <h3 className="h6 text-white mb-2">⚔️ Chaveamento Real</h3>
            <p className="small text-muted mb-0">
              Simule a fase de 32 avos, oitavas, quartas, semis e final, escolhendo quem avança.
            </p>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-4">
          <div className="stat-card p-3 text-start h-100">
            <h3 className="h6 text-white mb-2">🏅 Conquistas & Perfis</h3>
            <p className="small text-muted mb-0">
              Ganhe medalhas virtuais e descubra se o seu perfil de palpites é de zebra ou favorito.
            </p>
          </div>
        </div>
      </div>

      <div className="d-flex flex-column align-items-center gap-3 mt-4">
        {hasSavedData && (
          <button
            onClick={onContinue}
            className="btn btn-primary btn-lg w-100"
            style={{ maxWidth: '350px', background: 'linear-gradient(135deg, #00b7ff, #19c463)' }}
          >
            ▶ Continuar Simulação Salva
          </button>
        )}

        <button
          onClick={onStartNew}
          className={`btn ${hasSavedData ? 'btn-outline-light' : 'btn-primary'} btn-lg w-100`}
          style={{ maxWidth: '350px' }}
        >
          ✨ Iniciar Nova Simulação
        </button>

        {hasOfficialResults && (
          <button
            onClick={onImportOfficial}
            className="btn btn-outline-success btn-lg w-100"
            style={{ maxWidth: '350px', border: '2px solid var(--primary)', color: 'var(--primary)', fontWeight: 'bold' }}
          >
            🏆 Importar Resultados Oficiais da API
          </button>
        )}

        {hasIndividualPalpites && (
          <button
            onClick={onImport}
            className="btn btn-share-secondary btn-lg w-100"
            style={{ maxWidth: '350px' }}
          >
            📥 Usar Meus Palpites Salvos Como Base
          </button>
        )}
      </div>

      <div className="notice mt-5 text-start mx-auto" style={{ maxWidth: '750px' }}>
        <p className="small mb-0 text-muted">
          💡 <strong>Como funciona:</strong> Ao avançar pelas fases, seus dados são salvos 
          automaticamente no navegador. Se você alterar o resultado de uma fase anterior após 
          já ter avançado, as fases seguintes serão recalculadas e reiniciadas para evitar 
          inconsistências de chaveamento.
        </p>
      </div>
    </article>
  );
}
