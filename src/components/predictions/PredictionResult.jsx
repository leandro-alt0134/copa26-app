import React from 'react';
import { gerarPerfilPalpiteiro } from '../../utils/predictionProfile';

function formatarVencedor(nome) {
  if (nome === 'Empate') return 'Empate';
  
  // Lista de seleções femininas ou com preposição 'da'
  const daList = [
    'Croácia', 'França', 'Espanha', 'Alemanha', 'Bélgica', 'Inglaterra', 
    'Coreia do Sul', 'Polônia', 'Holanda', 'Ucrânia', 'Sérvia', 'Dinamarca',
    'Austrália', 'Costa Rica', 'Tunísia', 'Suécia'
  ];
  // Seleções com preposição 'dos'
  const dosList = ['Estados Unidos', 'Países Baixos'];
  
  if (daList.some(t => nome.toLowerCase().includes(t.toLowerCase()))) {
    return `Vitória da ${nome}`;
  }
  if (dosList.some(t => nome.toLowerCase().includes(t.toLowerCase()))) {
    return `Vitória dos ${nome}`;
  }
  return `Vitória do ${nome}`;
}

export default function PredictionResult({
  partidaAtual,
  sugestao,
  tipoPalpite,
  palpiteFinal,
  respostas
}) {
  if (!sugestao || !partidaAtual) return null;

  const resultadoDisplay = formatarVencedor(sugestao.resultadoSugerido);
  
  // Calcular o perfil dinamicamente com base no palpite final atual e respostas
  const perfil = gerarPerfilPalpiteiro(respostas, palpiteFinal, sugestao, partidaAtual);

  return (
    <div className="suggestion-card mb-4">
      {/* Cabeçalho do Resultado Sugerido */}
      <div className="suggestion-header">
        <span 
          className="hero-badge mb-2" 
          style={{ 
            borderColor: 'rgba(0, 200, 83, 0.4)', 
            background: 'rgba(0, 200, 83, 0.15)', 
            color: '#dcfce7',
            fontSize: '0.82rem'
          }}
        >
          🔍 {sugestao.nivelConfianca}
        </span>
        <h2 className="h6 text-white-50 text-uppercase mt-2 mb-1" style={{ letterSpacing: '0.05em' }}>
          Resultado Sugerido
        </h2>
        <div className="suggestion-trend">
          {resultadoDisplay}
        </div>
        
        {/* Explicação baseada nas respostas */}
        <p 
          className="mt-3 text-white-50 mb-0 px-3" 
          style={{ fontSize: '0.95rem', lineHeight: '1.5' }}
          dangerouslySetInnerHTML={{ __html: sugestao.descricao }}
        ></p>
      </div>

      {/* Pontuação detalhada */}
      <div className="text-center mt-4 pt-3 border-top border-light-subtle">
        <span className="small text-white-50">Distribuição de pontos da sua análise:</span>
        <div className="suggestion-scores-grid">
          <div 
            className={`suggestion-score-badge ${
              sugestao.pontosA > sugestao.pontosB && sugestao.pontosA > sugestao.pontosEmpate ? 'winner' : ''
            }`}
          >
            <span className="text-truncate" style={{ maxWidth: '100px' }}>{partidaAtual.selecaoA}</span> 
            <span className="suggestion-score-num">{sugestao.pontosA}</span>
          </div>
          <div 
            className={`suggestion-score-badge ${
              sugestao.pontosEmpate >= sugestao.pontosA && sugestao.pontosEmpate >= sugestao.pontosB ? 'winner' : ''
            }`}
          >
            <span>Empate</span> 
            <span className="suggestion-score-num">{sugestao.pontosEmpate}</span>
          </div>
          <div 
            className={`suggestion-score-badge ${
              sugestao.pontosB > sugestao.pontosA && sugestao.pontosB > sugestao.pontosEmpate ? 'winner' : ''
            }`}
          >
            <span className="text-truncate" style={{ maxWidth: '100px' }}>{partidaAtual.selecaoB}</span> 
            <span className="suggestion-score-num">{sugestao.pontosB}</span>
          </div>
        </div>
        
        <p className="text-white-50 small mt-2 mb-0">
          “Brasil {sugestao.pontosA} · Empate {sugestao.pontosEmpate} · Croácia {sugestao.pontosB}” (exemplo de distribuição)
        </p>
      </div>

      {/* Perfil de Palpiteiro */}
      <div className="profile-card">
        <div className="profile-icon">{perfil.icone}</div>
        <div className="profile-info">
          <span className="profile-title-label">Seu perfil de palpiteiro</span>
          <h4 className="profile-name">{perfil.nome}</h4>
          <p className="profile-desc">{perfil.descricao}</p>
        </div>
      </div>

      <div className="text-center text-white-50 small mt-3">
        💡 <em>Você ainda pode alterar seu palpite final antes de salvar.</em>
      </div>
    </div>
  );
}
export { formatarVencedor };
