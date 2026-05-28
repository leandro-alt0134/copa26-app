import React from 'react';
import { calcularConquistas } from '../../utils/predictionAchievements';

export default function PredictionAchievements({ palpites = [] }) {
  const conquistas = calcularConquistas(palpites);

  // Contar quantas conquistas foram desbloqueadas
  const desbloqueadasCount = conquistas.filter(c => c.unlocked).length;

  return (
    <section className="mb-4">
      <div className="history-section-card p-3 p-md-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="h5 text-white mb-0 font-weight-bold d-flex align-items-center gap-2">
            <span>🏆</span> Conquistas
          </h3>
          <span className="badge rounded-pill text-bg-warning px-3 py-1" style={{ color: '#061A12', fontWeight: 800, fontSize: '0.8rem' }}>
            {desbloqueadasCount} / {conquistas.length} Desbloqueadas
          </span>
        </div>

        <div className="achievements-grid">
          {conquistas.map((conq) => (
            <div 
              key={conq.id} 
              className={`achievement-card ${conq.unlocked ? 'unlocked' : 'locked'}`}
              title={conq.unlocked ? 'Desbloqueado!' : 'Bloqueado'}
            >
              <div className="achievement-badge-emoji">
                {conq.emoji}
              </div>
              <h4 className="achievement-card-title">
                {conq.titulo.replace(/^[^\s]+\s+/, '') /* Remove emoji do título pra não duplicar */}
              </h4>
              <p className="achievement-card-desc mb-0">
                {conq.descricao}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
