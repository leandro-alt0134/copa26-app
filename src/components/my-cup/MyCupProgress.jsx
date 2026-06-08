import React from 'react';

const STEPS = [
  { id: 'groups', label: 'Grupos', emoji: '🏟️' },
  { id: 'qualified', label: 'Classificação', emoji: '🧮' },
  { id: 'knockout', label: 'Mata-mata', emoji: '⚔️' },
  { id: 'semifinals', label: 'Semifinal', emoji: '🌟' },
  { id: 'final', label: 'Final', emoji: '🏆' },
  { id: 'champion', label: 'Campeão', emoji: '🥇' }
];

export default function MyCupProgress({ currentStep }) {
  // If we are in intro step, don't show progress
  if (currentStep === 'intro') return null;

  const currentIdx = STEPS.findIndex((s) => s.id === currentStep);
  const activeIdx = currentIdx >= 0 ? currentIdx : 0;

  // Calculate percentage of progress line
  const progressPercent = (activeIdx / (STEPS.length - 1)) * 90; // Adjust spacing to align with bubbles

  return (
    <div className="steps-container bg-transparent p-0 mb-5 text-center animate-fade-in">
      <div className="position-relative mx-auto" style={{ maxWidth: '800px' }}>
        <ul className="steps-list">
          {/* Progress fill line */}
          <div 
            className="steps-list-progress-line" 
            style={{ 
              width: `${progressPercent}%`, 
              left: '5%',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }} 
          />
          
          {STEPS.map((step, idx) => {
            let statusClass = '';
            if (idx < activeIdx) statusClass = 'completed';
            else if (idx === activeIdx) statusClass = 'active';

            return (
              <li 
                key={step.id} 
                className={`step-item ${statusClass}`}
                style={{ flex: 1 }}
              >
                <div 
                  className="step-bubble"
                  title={step.label}
                  aria-current={idx === activeIdx ? 'step' : undefined}
                >
                  {idx < activeIdx ? '✓' : step.emoji}
                </div>
                <span className="step-label d-none d-md-block">{step.label}</span>
                <span className="step-label d-block d-md-none" style={{ fontSize: '0.62rem' }}>
                  {step.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
