import React from 'react';
import { calculateMyCupAchievements } from '../../utils/myCupAchievements';

export default function MyCupAchievements({
  myCupData = {},
  selecoes = []
}) {
  const achievements = calculateMyCupAchievements(myCupData, selecoes);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="my-cup-achievements-widget animate-fade-in">
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom border-light-subtle pb-3">
        <div>
          <h3 className="h4 text-white mb-1">🏅 Conquistas Desbloqueadas</h3>
          <span className="small text-muted-old">Conquistas exclusivas de "Minha Copa"</span>
        </div>
        <div className="stat-card py-2 px-3 text-center">
          <span className="h5 font-weight-bold text-success mb-0">{unlockedCount} / 8</span>
          <span className="d-block small text-muted font-weight-bold" style={{ fontSize: '0.62rem' }}>Conquistadas</span>
        </div>
      </div>

      <div className="achievements-grid">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}`}
            title={ach.descricao}
            style={{ minHeight: '135px' }}
          >
            <span className="achievement-badge-emoji">{ach.emoji}</span>
            <div className="achievement-card-title mt-2">{ach.titulo}</div>
            <p className="achievement-card-desc mt-1 mb-0 px-2 text-center text-muted">
              {ach.descricao}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
