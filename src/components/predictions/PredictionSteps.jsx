import React from 'react';

const STEPS = [
  { num: 1, label: 'Partida' },
  { num: 2, label: 'Tipo' },
  { num: 3, label: 'Perguntas' },
  { num: 4, label: 'Resultado' },
  { num: 5, label: 'Salvar' }
];

export default function PredictionSteps({ currentStep }) {
  // Calcular a largura da linha de progresso
  // Há 5 etapas, então o progresso vai de 0% (etapa 1) a 90% (etapa 5) para alinhar com as bolhas
  const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 90;

  return (
    <div className="steps-container">
      <ul className="steps-list">
        {/* Linha de fundo cinza já é desenhada via CSS */}
        {/* Linha de progresso ativa verde */}
        <div 
          className="steps-list-progress-line" 
          style={{ width: `${progressPercent}%` }}
        />
        
        {STEPS.map((step) => {
          const isCompleted = step.num < currentStep;
          const isActive = step.num === currentStep;
          
          let itemClass = "";
          if (isCompleted) itemClass = "completed";
          else if (isActive) itemClass = "active";

          return (
            <li key={step.num} className={`step-item ${itemClass}`}>
              <div className="step-bubble">
                {isCompleted ? "✓" : step.num}
              </div>
              <span className="step-label">{step.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
