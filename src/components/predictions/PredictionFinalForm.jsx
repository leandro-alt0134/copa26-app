import React from 'react';

export default function PredictionFinalForm({
  partidaAtual,
  palpiteFinal,
  setPalpiteFinal,
  placarA,
  setPlacarA,
  placarB,
  setPlacarB,
  salvarPalpite
}) {
  if (!partidaAtual) return null;

  return (
    <div className="user-prediction-form mt-4">
      <h3 className="h5 text-white text-center mb-3 font-weight-bold">Registrar seu palpite final</h3>
      <form onSubmit={salvarPalpite}>
        <p className="text-center text-white-50 small mb-2">Quem você acha que vencerá de fato?</p>
        
        <div className="prediction-options-group">
          <div>
            <input
              type="radio"
              name="palpite_final_opcao"
              id="radio-final-a"
              className="prediction-radio-input"
              value={partidaAtual.selecaoA}
              checked={palpiteFinal === partidaAtual.selecaoA}
              onChange={() => setPalpiteFinal(partidaAtual.selecaoA)}
              required
            />
            <label htmlFor="radio-final-a" className="prediction-radio-label">
              Vitória do {partidaAtual.selecaoA}
            </label>
          </div>
          <div>
            <input
              type="radio"
              name="palpite_final_opcao"
              id="radio-final-empate"
              className="prediction-radio-input"
              value="Empate"
              checked={palpiteFinal === 'Empate'}
              onChange={() => setPalpiteFinal('Empate')}
              required
            />
            <label htmlFor="radio-final-empate" className="prediction-radio-label">
              Empate
            </label>
          </div>
          <div>
            <input
              type="radio"
              name="palpite_final_opcao"
              id="radio-final-b"
              className="prediction-radio-input"
              value={partidaAtual.selecaoB}
              checked={palpiteFinal === partidaAtual.selecaoB}
              onChange={() => setPalpiteFinal(partidaAtual.selecaoB)}
              required
            />
            <label htmlFor="radio-final-b" className="prediction-radio-label">
              Vitória da {partidaAtual.selecaoB}
            </label>
          </div>
        </div>

        <p className="text-center text-white-50 small mb-2 mt-4">Qual será o placar exato da partida?</p>
        
        <div className="score-inputs-wrapper">
          <span className="score-team-label text-truncate">{partidaAtual.selecaoA}</span>
          <input
            type="number"
            className="score-number-input"
            min="0"
            max="99"
            value={placarA}
            onChange={(e) => setPlacarA(e.target.value)}
            required
            aria-label={`Placar ${partidaAtual.selecaoA}`}
          />
          <span className="score-divider">x</span>
          <input
            type="number"
            className="score-number-input"
            min="0"
            max="99"
            value={placarB}
            onChange={(e) => setPlacarB(e.target.value)}
            required
            aria-label={`Placar ${partidaAtual.selecaoB}`}
          />
          <span className="score-team-label team-b text-truncate">{partidaAtual.selecaoB}</span>
        </div>

        <div className="text-center mt-4">
          <button 
            type="submit" 
            className="btn btn-primary px-5 py-3" 
            style={{ borderRadius: '14px', fontSize: '1rem', transition: 'all 0.2s' }}
          >
            💾 Salvar meu palpite
          </button>
        </div>
      </form>
    </div>
  );
}
