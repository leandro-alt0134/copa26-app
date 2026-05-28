import React, { useState } from 'react';
import { formatarVencedor } from './PredictionResult';

export default function PredictionHistory({
  palpitesSalvos = [],
  partidas = [],
  onDownloadCard,
  onShareWhatsApp,
  onDownloadTXT,
  onClearHistory
}) {
  const [filtro, setFiltro] = useState('todos'); // 'todos' | 'rapido' | 'detalhado'
  const [ordenacao, setOrdenacao] = useState('recentes'); // 'recentes' | 'grupo'

  const totalPalpites = palpitesSalvos.length;

  if (totalPalpites === 0) {
    return (
      <section className="history-section-card" id="secao-historico">
        <h2 className="h5 text-white mb-3">🏆 Meus palpites salvos</h2>
        <div className="history-empty">
          <p className="mb-0">Você ainda não salvou nenhum palpite. Escolha um confronto acima para começar!</p>
        </div>
      </section>
    );
  }

  // Filtragem
  const palpitesFiltrados = palpitesSalvos.filter((p) => {
    if (filtro === 'rapido') return p.tipoPalpite === 'rapido';
    if (filtro === 'detalhado') return p.tipoPalpite === 'detalhado';
    return true;
  });

  // Ordenação
  const palpitesOrdenados = [...palpitesFiltrados].sort((a, b) => {
    if (ordenacao === 'grupo') {
      const grupoComp = a.grupo.localeCompare(b.grupo);
      if (grupoComp !== 0) return grupoComp;
      
      const rodadaComp = (a.rodada || 0) - (b.rodada || 0);
      if (rodadaComp !== 0) return rodadaComp;

      // Se empatar em grupo e rodada, mais recente primeiro
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    
    // Default: mais recentes primeiro
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <section className="history-section-card" id="secao-historico">
      {/* Cabeçalho */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h2 className="h5 text-white mb-0">🏆 Meus palpites salvos</h2>
          <span className="text-white-50 small">
            Você já salvou {totalPalpites} {totalPalpites === 1 ? 'palpite' : 'palpites'}.
          </span>
        </div>
        
        <div className="d-flex gap-2 align-items-center flex-wrap">
          <button
            type="button"
            className="btn-whatsapp-share"
            onClick={onShareWhatsApp}
          >
            🟢 WhatsApp
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-light px-3 py-1"
            style={{ borderRadius: '10px' }}
            onClick={onDownloadTXT}
          >
            📥 Baixar TXT
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger px-3 py-1"
            style={{ borderRadius: '10px' }}
            onClick={onClearHistory}
          >
            Limpar tudo
          </button>
        </div>
      </div>

      {/* Controles de Filtro e Ordenação */}
      <div className="history-controls">
        {/* Filtros */}
        <div className="history-filter-group">
          <button 
            type="button"
            className={`btn-filter-tag ${filtro === 'todos' ? 'active' : ''}`}
            onClick={() => setFiltro('todos')}
          >
            Todos ({totalPalpites})
          </button>
          <button 
            type="button"
            className={`btn-filter-tag ${filtro === 'rapido' ? 'active' : ''}`}
            onClick={() => setFiltro('rapido')}
          >
            Rápidos ({palpitesSalvos.filter(p => p.tipoPalpite === 'rapido').length})
          </button>
          <button 
            type="button"
            className={`btn-filter-tag ${filtro === 'detalhado' ? 'active' : ''}`}
            onClick={() => setFiltro('detalhado')}
          >
            Detalhados ({palpitesSalvos.filter(p => p.tipoPalpite === 'detalhado').length})
          </button>
        </div>

        {/* Ordenação */}
        <div className="history-sort-group">
          <label htmlFor="history-sort-select" className="history-sort-label">Ordenar por:</label>
          <select 
            id="history-sort-select" 
            className="history-sort-select"
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
          >
            <option value="recentes">Mais recentes</option>
            <option value="grupo">Grupo / Rodada</option>
          </select>
        </div>
      </div>

      {/* Lista de Cards */}
      <div className="row g-3" id="historico-palpites-lista">
        {palpitesOrdenados.length === 0 ? (
          <div className="col-12">
            <div className="history-empty py-4">
              <p className="mb-0 text-white-50">Nenhum palpite corresponde ao filtro selecionado.</p>
            </div>
          </div>
        ) : (
          palpitesOrdenados.map((palpite) => {
            const partidaInfo = partidas.find((p) => p.id === palpite.matchId);
            const escudoA = partidaInfo ? partidaInfo.escudoA : 'escudos/default.svg';
            const escudoB = partidaInfo ? partidaInfo.escudoB : 'escudos/default.svg';

            const dataFormatada = new Date(palpite.createdAt).toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            const modoDisplay = palpite.tipoPalpite === 'detalhado' ? 'Detalhado' : 'Rápido';
            const confDisplay = palpite.nivelConfianca || 'Tendência leve';
            
            const perfilNome = typeof palpite.perfilPalpiteiro === 'object' 
              ? palpite.perfilPalpiteiro.nome 
              : palpite.perfilPalpiteiro || 'Palpiteiro da Copa';
            const perfilIcon = typeof palpite.perfilPalpiteiro === 'object' 
              ? palpite.perfilPalpiteiro.icone 
              : '⚽';

            const winnerText = formatarVencedor(palpite.palpiteFinal);
            const winnerSugText = formatarVencedor(palpite.resultadoSugerido);

            return (
              <div className="col-12 col-md-6" key={`${palpite.matchId}-${palpite.tipoPalpite}`}>
                <div className="history-item-card">
                  <div className="history-item-header">
                    <span className="history-item-badge">
                      Grupo {palpite.grupo} — Rodada {palpite.rodada} ({modoDisplay})
                    </span>
                    <span className="history-item-date">{dataFormatada}</span>
                  </div>

                  <div className="history-matchup">
                    <div className="history-matchup-team">
                      <img
                        src={`/${escudoA}`}
                        alt={`Escudo de ${palpite.selecaoA}`}
                        onError={(e) => { e.currentTarget.src = '/assets/copa-2026-logo-white.svg'; }}
                      />
                      <span>{palpite.selecaoA}</span>
                    </div>
                    <div className="history-score-display">
                      {palpite.placar.selecaoA} x {palpite.placar.selecaoB}
                    </div>
                    <div className="history-matchup-team text-end justify-content-end">
                      <span>{palpite.selecaoB}</span>
                      <img
                        src={`/${escudoB}`}
                        alt={`Escudo de ${palpite.selecaoB}`}
                        onError={(e) => { e.currentTarget.src = '/assets/copa-2026-logo-white.svg'; }}
                      />
                    </div>
                  </div>

                  <div className="history-item-details">
                    <span className="history-detail-label">Confiança:</span>
                    <span className="history-detail-val suggested" style={{ color: 'var(--accent)' }}>
                      {confDisplay}
                    </span>

                    <span className="history-detail-label">Sugestão quiz:</span>
                    <span className="history-detail-val suggested" title={winnerSugText}>
                      {winnerSugText}
                    </span>

                    <span className="history-detail-label">Palpite final:</span>
                    <span className="history-detail-val final-pick" title={winnerText}>
                      {winnerText}
                    </span>

                    <span className="history-detail-label">Perfil:</span>
                    <span className="history-detail-val text-white" title={perfilNome}>
                      {perfilIcon} {perfilNome}
                    </span>
                  </div>

                  {/* Distribuição detalhada de pontos */}
                  {palpite.pontuacao && (
                    <div className="mt-2 pt-2 border-top border-light-subtle small text-white-50 text-center">
                      {palpite.selecaoA} {palpite.pontuacao.selecaoA} · Empate {palpite.pontuacao.empate} · {palpite.selecaoB} {palpite.pontuacao.selecaoB}
                    </div>
                  )}

                  {/* Downloads de Imagem */}
                  <div className="row g-2 mt-2">
                    <div className="col-6">
                      <button
                        type="button"
                        className="btn btn-sm btn-success w-100 btn-share-secondary justify-content-center"
                        onClick={() => onDownloadCard(palpite.matchId, palpite.tipoPalpite, 'square')}
                        style={{ fontSize: '0.78rem', minHeight: '34px' }}
                      >
                        🖼️ Card Quadrado
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        type="button"
                        className="btn btn-sm btn-success w-100 btn-share-secondary justify-content-center"
                        onClick={() => onDownloadCard(palpite.matchId, palpite.tipoPalpite, 'stories')}
                        style={{ fontSize: '0.78rem', minHeight: '34px' }}
                      >
                        📱 Card Stories
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
