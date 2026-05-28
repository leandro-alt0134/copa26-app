import React from 'react';

export default function PredictionStats({ palpites = [] }) {
  if (palpites.length === 0) return null;

  const total = palpites.length;
  
  // Contadores de tipo
  const rapidos = palpites.filter(p => p.tipoPalpite === 'rapido').length;
  const detalhados = palpites.filter(p => p.tipoPalpite === 'detalhado').length;
  const tipoMaisUsado = rapidos === detalhados ? 'Empate' : (rapidos > detalhados ? 'Rápido' : 'Detalhado');

  // Contadores de Palpite Final (Vitória A, Empate, Vitória B)
  let vitoriasA = 0;
  let empates = 0;
  let vitoriasB = 0;

  // Mapa de frequências para Placar e Perfil
  const placarFreq = {};
  const perfilFreq = {};

  palpites.forEach(p => {
    // 1. Proporções
    if (p.palpiteFinal === 'Empate') {
      empates++;
    } else if (p.palpiteFinal === p.selecaoA) {
      vitoriasA++;
    } else if (p.palpiteFinal === p.selecaoB) {
      vitoriasB++;
    } else {
      vitoriasA++;
    }

    // 2. Placar mais usado
    if (p.placar) {
      const placarStr = `${p.placar.selecaoA}x${p.placar.selecaoB}`;
      placarFreq[placarStr] = (placarFreq[placarStr] || 0) + 1;
    }

    // 3. Perfil mais frequente
    const perfilNome = typeof p.perfilPalpiteiro === 'object' ? p.perfilPalpiteiro.nome : (p.perfilPalpiteiro || 'Palpiteiro da Copa');
    perfilFreq[perfilNome] = (perfilFreq[perfilNome] || 0) + 1;
  });

  // Achar placar mais frequente
  let placarMaisUsado = 'N/A';
  let maxPlacarCount = 0;
  Object.entries(placarFreq).forEach(([placar, count]) => {
    if (count > maxPlacarCount) {
      maxPlacarCount = count;
      placarMaisUsado = placar;
    }
  });

  // Achar perfil mais frequente
  let perfilMaisComum = 'Palpiteiro da Copa';
  let maxPerfilCount = 0;
  Object.entries(perfilFreq).forEach(([perfil, count]) => {
    if (count > maxPerfilCount) {
      maxPerfilCount = count;
      perfilMaisComum = perfil;
    }
  });

  // Percentuais
  const pctA = Math.round((vitoriasA / total) * 100) || 0;
  const pctEmpate = Math.round((empates / total) * 100) || 0;
  const pctB = Math.round((vitoriasB / total) * 100) || 0;

  return (
    <section className="mb-4">
      <div className="history-section-card p-3 p-md-4">
        <h3 className="h5 text-white mb-3 font-weight-bold d-flex align-items-center gap-2">
          <span>📊</span> Suas estatísticas
        </h3>

        {/* KPIs principais */}
        <div className="kpi-stats-grid">
          <div className="kpi-stat-card">
            <span className="kpi-stat-val">{total}</span>
            <div className="kpi-stat-desc">Palpites Salvos</div>
          </div>
          <div className="kpi-stat-card">
            <span className="kpi-stat-val" style={{ fontSize: '1.2rem', color: 'var(--blue)' }}>
              {tipoMaisUsado}
            </span>
            <div className="kpi-stat-desc">Modo Mais Usado</div>
          </div>
          <div className="kpi-stat-card">
            <span className="kpi-stat-val" style={{ fontSize: '1.2rem', color: 'var(--accent)' }}>
              {placarMaisUsado}
            </span>
            <div className="kpi-stat-desc">Placar Mais Comum</div>
          </div>
          <div className="kpi-stat-card">
            <span className="kpi-stat-val" style={{ fontSize: '1.05rem', color: 'var(--primary)' }}>
              {perfilMaisComum}
            </span>
            <div className="kpi-stat-desc">Perfil Mais Frequente</div>
          </div>
        </div>

        {/* Proporções Gráficas */}
        <div className="stats-proportions-container">
          <div className="stats-proportions-labels">
            <span>Vitória Mandante ({pctA}%)</span>
            <span>Empate ({pctEmpate}%)</span>
            <span>Vitória Visitante ({pctB}%)</span>
          </div>
          <div className="stats-proportions-bar">
            <div className="prop-bar-segment win-a" style={{ width: `${pctA}%` }} title={`Mandante: ${pctA}%`} />
            <div className="prop-bar-segment draw" style={{ width: `${pctEmpate}%` }} title={`Empate: ${pctEmpate}%`} />
            <div className="prop-bar-segment win-b" style={{ width: `${pctB}%` }} title={`Visitante: ${pctB}%`} />
          </div>
        </div>

        <div className="text-white-50 small mt-2 text-center">
          <em>Calculado a partir de {rapidos} palpites rápidos e {detalhados} detalhados.</em>
        </div>
      </div>
    </section>
  );
}
