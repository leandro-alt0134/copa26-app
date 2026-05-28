import React, { useState, useEffect } from 'react';

export default function PredictionQuiz({
  tipoPalpite,
  partidaAtual,
  respostas,
  handleRespostaChange,
  handleTrocarTipo,
  calcularSugestao,
  perguntasAtuais
}) {
  const [currIndex, setCurrIndex] = useState(0);
  const [showTip, setShowTip] = useState(false);

  // Resetar o índice ao trocar de tipo de palpite ou de partida
  useEffect(() => {
    setCurrIndex(0);
    setShowTip(false);
  }, [tipoPalpite, partidaAtual?.id]);

  if (perguntasAtuais.length === 0) return null;

  const totalPerguntas = perguntasAtuais.length;
  
  // Calcular respostas dadas
  const answeredCount = perguntasAtuais.filter(
    (p) => respostas[p.id] !== undefined && respostas[p.id] !== ''
  ).length;

  const progressPercent = Math.round((answeredCount / totalPerguntas) * 100);
  const quizCompletado = answeredCount === totalPerguntas;

  const currentPergunta = perguntasAtuais[currIndex];
  const isLastQuestion = currIndex === totalPerguntas - 1;

  const handleOptionSelect = (perguntaId, valor) => {
    handleRespostaChange(perguntaId, valor);
    
    // Auto-avançar após 350ms se não for a última pergunta
    if (!isLastQuestion) {
      setTimeout(() => {
        setCurrIndex((prev) => Math.min(prev + 1, totalPerguntas - 1));
        setShowTip(false);
      }, 350);
    }
  };

  const handleAnterior = () => {
    setCurrIndex((prev) => Math.max(prev - 1, 0));
    setShowTip(false);
  };

  const handleProximo = () => {
    setCurrIndex((prev) => Math.min(prev + 1, totalPerguntas - 1));
    setShowTip(false);
  };

  return (
    <section id="secao-questionario" className="mb-4">
      {/* Header com o título e botão Trocar */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h2 className="h5 text-white mb-0 font-weight-bold">
          Análise do Confronto ({tipoPalpite === 'rapido' ? 'Modo Rápido' : 'Modo Detalhado'})
        </h2>
        <button
          type="button"
          className="btn btn-sm btn-outline-light px-3 py-1"
          style={{ borderRadius: '10px', fontSize: '0.8rem' }}
          onClick={handleTrocarTipo}
        >
          🔄 Trocar tipo de palpite
        </button>
      </div>

      {/* Barra de Progresso do Questionário */}
      <div className="quiz-progress-container">
        <div className="quiz-progress-header">
          <span className="quiz-progress-text">
            Você respondeu {answeredCount} de {totalPerguntas} perguntas
          </span>
          <span className="quiz-progress-percentage">{progressPercent}%</span>
        </div>
        <div className="quiz-progress-track">
          <div className="quiz-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Card da Pergunta Atual com animação */}
      <div 
        className={`quiz-card mb-4 ${tipoPalpite === 'rapido' ? 'quick-mode-active' : 'detail-mode-active'}`} 
        key={currentPergunta.id}
      >
        <div className="quiz-question-wrapper">
          {/* Título da Pergunta */}
          <h3 className="quiz-question-title">
            <span className="quiz-question-number">{currIndex + 1}</span>
            {currentPergunta.titulo}
          </h3>

          {/* Dica de Ajuda recolhível (para o Detalhado) */}
          {currentPergunta.ajuda && (
            <div className="quiz-tip-container">
              <button 
                type="button" 
                className="quiz-tip-toggle"
                onClick={() => setShowTip(!showTip)}
              >
                {showTip ? '💡 Ocultar dica tática' : '💡 Ver dica tática'}
              </button>
              {showTip && (
                <div className="quiz-tip-content">
                  {currentPergunta.ajuda}
                </div>
              )}
            </div>
          )}

          {/* Opções de Resposta */}
          <div className="quiz-options-group">
            {currentPergunta.opcoes.map((opt, oIdx) => {
              const isSelected = respostas[currentPergunta.id] === opt.valor;
              return (
                <div key={`${currentPergunta.id}-${oIdx}`}>
                  <input
                    type="radio"
                    name={`q_${currentPergunta.id}`}
                    id={`q_${currentPergunta.id}_${oIdx}`}
                    className="quiz-option-input"
                    value={opt.valor}
                    checked={isSelected}
                    onChange={() => handleOptionSelect(currentPergunta.id, opt.valor)}
                    required
                  />
                  <label htmlFor={`q_${currentPergunta.id}_${oIdx}`} className="quiz-option-label">
                    {opt.texto}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Barra de Navegação Inferior da Pergunta */}
        <div className="quiz-navigation-bar">
          <button
            type="button"
            className="btn btn-outline-light px-4 py-2"
            disabled={currIndex === 0}
            onClick={handleAnterior}
            style={{ borderRadius: '12px', fontSize: '0.9rem' }}
          >
            ← Anterior
          </button>
          
          <span className="text-white-50 small">
            Pergunta {currIndex + 1} de {totalPerguntas}
          </span>

          {!isLastQuestion ? (
            <button
              type="button"
              className="btn btn-outline-light px-4 py-2"
              disabled={respostas[currentPergunta.id] === undefined || respostas[currentPergunta.id] === ''}
              onClick={handleProximo}
              style={{ borderRadius: '12px', fontSize: '0.9rem' }}
            >
              Próxima →
            </button>
          ) : (
            <button
              type="button"
              id="btn-ver-sugestao"
              className={`btn btn-primary px-4 py-2 ${quizCompletado ? 'btn-pulse' : ''}`}
              disabled={!quizCompletado}
              onClick={calcularSugestao}
              style={{ borderRadius: '12px', fontSize: '0.9rem' }}
            >
              Ver sugestão
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
