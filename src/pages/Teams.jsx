import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Countdown from '../components/Countdown';

export default function Teams() {
  const [selecoes, setSelecoes] = useState([]);
  const [busca, setBusca] = useState('');
  const [confederacao, setConfederacao] = useState('todas');
  const [ordenacao, setOrdenacao] = useState('nome');
  const [comparados, setComparados] = useState([]);
  const [modalEscudo, setModalEscudo] = useState(null);
  const [modalCompareOpen, setModalCompareOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/selecoes.json')
      .then((res) => res.json())
      .then((data) => {
        setSelecoes(data.copa_2026 || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar seleções:', err);
        setLoading(false);
      });
  }, []);

  const normalizarTexto = (texto) => {
    return String(texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  const valorOuPadrao = (val) => {
    return val === null || val === undefined || val === '' ? 'A confirmar' : val;
  };

  const nomeArquivoSeguro = (nome) => {
    return normalizarTexto(nome)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'escudo';
  };

  // Filtragem
  const selecoesFiltradas = selecoes.filter((s) => {
    const termo = normalizarTexto(busca);
    const matchesBusca =
      termo === '' ||
      normalizarTexto(s.nome).includes(termo) ||
      normalizarTexto(s.federacao).includes(termo);
    const matchesConfed = confederacao === 'todas' || s.confederacao === confederacao;
    return matchesBusca && matchesConfed;
  });

  // Ordenação
  const selecoesOrdenadas = [...selecoesFiltradas].sort((a, b) => {
    if (ordenacao === 'ranking') {
      const rA = a.rankingFifa === 'A confirmar' || a.rankingFifa === null ? 999 : Number(a.rankingFifa);
      const rB = b.rankingFifa === 'A confirmar' || b.rankingFifa === null ? 999 : Number(b.rankingFifa);
      return rA - rB;
    }
    if (ordenacao === 'titulos') {
      const tA = Number(a.titulos) || 0;
      const tB = Number(b.titulos) || 0;
      return tB - tA || a.nome.localeCompare(b.nome, 'pt-BR');
    }
    if (ordenacao === 'participacoes') {
      const pA = Number(a.participacoes) || 0;
      const pB = Number(b.participacoes) || 0;
      return pB - pA || a.nome.localeCompare(b.nome, 'pt-BR');
    }
    return a.nome.localeCompare(b.nome, 'pt-BR');
  });

  const totalTitulos = selecoes.reduce((acc, s) => acc + (Number(s.titulos) || 0), 0);

  // Manipulação de Comparador
  const toggleComparar = (selecao) => {
    const index = comparados.findIndex((c) => c.nome === selecao.nome);
    if (index !== -1) {
      setComparados(comparados.filter((c) => c.nome !== selecao.nome));
    } else {
      if (comparados.length >= 2) {
        alert('Você só pode comparar 2 seleções ao mesmo tempo. Remova uma primeiro!');
        return;
      }
      setComparados([...comparados, selecao]);
    }
  };

  const removerComparado = (nome) => {
    setComparados(comparados.filter((c) => c.nome !== nome));
  };

  const limparComparados = () => {
    setComparados([]);
  };

  // Cálculo de Porcentagens de Comparação
  const t1 = comparados[0];
  const t2 = comparados[1];

  let pctTit1 = 0, pctTit2 = 0;
  let pctRank1 = 50, pctRank2 = 50;
  let pctPart1 = 0, pctPart2 = 0;

  if (t1 && t2) {
    const tit1 = Number(t1.titulos) || 0;
    const tit2 = Number(t2.titulos) || 0;
    const maxTit = Math.max(tit1 + tit2, 1);
    pctTit1 = (tit1 / maxTit) * 100;
    pctTit2 = (tit2 / maxTit) * 100;

    const rankNum1 = t1.rankingFifa === 'A confirmar' ? 100 : Number(t1.rankingFifa) || 100;
    const rankNum2 = t2.rankingFifa === 'A confirmar' ? 100 : Number(t2.rankingFifa) || 100;
    const score1 = Math.max(101 - rankNum1, 1);
    const score2 = Math.max(101 - rankNum2, 1);
    const totalScore = score1 + score2;
    pctRank1 = (score1 / totalScore) * 100;
    pctRank2 = (score2 / totalScore) * 100;

    const part1 = Number(t1.participacoes) || 0;
    const part2 = Number(t2.participacoes) || 0;
    const maxPart = Math.max(part1 + part2, 1);
    pctPart1 = (part1 / maxPart) * 100;
    pctPart2 = (part2 / maxPart) * 100;
  }

  return (
    <main className="container pb-5">
      {/* Dashboard de Ações Rápidas (PWA/Mobile First) */}
      <section className="quick-actions-dashboard mb-4">
        <div className="quick-actions-grid">
          <Link to="/palpites" className="quick-action-card">
            <span className="quick-action-icon">🎯</span>
            <div className="quick-action-info">
              <h3>Fazer meu palpite</h3>
              <p>Responda o quiz e simule o placar</p>
            </div>
          </Link>
          <Link to="/confrontos" className="quick-action-card">
            <span className="quick-action-icon">⚽</span>
            <div className="quick-action-info">
              <h3>Ver confrontos</h3>
              <p>Tabela de jogos da primeira fase</p>
            </div>
          </Link>
          <Link to="/grupos" className="quick-action-card">
            <span className="quick-action-icon">🏆</span>
            <div className="quick-action-info">
              <h3>Ver grupos</h3>
              <p>Classificação e chaveamento</p>
            </div>
          </Link>
          <a href="#lista-selecoes" className="quick-action-card">
            <span className="quick-action-icon">🌎</span>
            <div className="quick-action-info">
              <h3>Ver seleções</h3>
              <p>Cards, estatísticas e títulos</p>
            </div>
          </a>
        </div>
      </section>

      {/* Hero / Introdução */}
      <section className="hero mb-4">
        <div className="row align-items-center g-0">
          <div className="col-lg-8 hero-content p-4 p-md-5 position-relative">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <span className="hero-badge">🏆 FIFA World Cup 2026</span>
              <Countdown />
            </div>
            <h1>Guia visual das seleções da Copa</h1>
            <p>Cards com escudo, informações básicas e a bandeira de cada país aplicada como marca d’água no fundo do card.</p>
            <div className="row g-3 mt-3">
              <div className="col-6 col-md-3">
                <div className="stat-card">
                  <span className="stat-number">{loading ? '—' : selecoes.length}</span>
                  <span className="stat-label">seleções</span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="stat-card">
                  <span className="stat-number">3</span>
                  <span className="stat-label">países-sede</span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="stat-card">
                  <span className="stat-number">2026</span>
                  <span className="stat-label">temporada</span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="stat-card">
                  <span className="stat-number">{loading ? '—' : totalTitulos}</span>
                  <span className="stat-label">títulos somados</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 text-center p-4 p-md-5 position-relative">
            <img src="/assets/copa-2026-logo.svg" className="hero-logo" alt="Logo da Copa do Mundo FIFA 2026" decoding="async" />
          </div>
        </div>
      </section>

      {/* Publicidade Superior */}
      <section className="ad-slot ad-slot--hero mb-4" aria-label="Espaço para anúncio">
        <span className="ad-slot__label">Publicidade</span>
        <div className="ad-slot__placeholder">Espaço estratégico para Google AdSense — banner horizontal superior</div>
      </section>

      {/* Barra de Filtros */}
      <section className="toolbar p-3 p-md-4 mb-4">
        <div className="row align-items-end g-3">
          <div className="col-12 col-md-6 col-lg-4">
            <label htmlFor="busca" className="form-label small text-white-50 mb-1">Buscar seleção</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent text-white-50 border-end-0" style={{ borderColor: 'rgba(255, 255, 255, .16)' }}>🔍</span>
              <input
                type="search"
                id="busca"
                className="form-control border-start-0 ps-0"
                placeholder="Nome da seleção ou federação..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <label htmlFor="filtro-confederacao" className="form-label small text-white-50 mb-1">Filtrar por Confederação</label>
            <select
              id="filtro-confederacao"
              className="form-select"
              value={confederacao}
              onChange={(e) => setConfederacao(e.target.value)}
            >
              <option value="todas">Todas as confederações</option>
              <option value="UEFA">UEFA (Europa)</option>
              <option value="CONMEBOL">CONMEBOL (América do Sul)</option>
              <option value="CONCACAF">CONCACAF (América do Norte/Central)</option>
              <option value="CAF">CAF (África)</option>
              <option value="AFC">AFC (Ásia)</option>
              <option value="OFC">OFC (Oceania)</option>
            </select>
          </div>
          <div className="col-12 col-lg-4">
            <label htmlFor="ordenacao" className="form-label small text-white-50 mb-1">Ordenar seleções</label>
            <select
              id="ordenacao"
              className="form-select"
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
            >
              <option value="nome">Ordem alfabética A - Z</option>
              <option value="titulos">Com mais títulos</option>
              <option value="participacoes">Com mais participações</option>
              <option value="ranking">Posição no ranking da FIFA</option>
            </select>
          </div>
        </div>
        <div className="row mt-2 g-2 align-items-center">
          <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div id="confederacao-info" className="small text-white-50">
              {confederacao === 'todas'
                ? busca.trim() !== '' ? `Filtrando resultados por "${busca}"` : ''
                : `Confederação: ${confederacao}${busca.trim() !== '' ? ` | Busca: "${busca}"` : ''}`}
            </div>
            <span id="contador" className="badge rounded-pill text-bg-light px-3 py-2">
              {loading ? 'Carregando...' : `${selecoesOrdenadas.length} seleções exibidas`}
            </span>
          </div>
        </div>
      </section>

      {/* Lista de Seleções */}
      <section>
        <div className="row g-3 g-md-4" id="lista-selecoes">
          {loading ? (
            <div className="col-12">
              <div className="empty-state">Carregando seleções...</div>
            </div>
          ) : selecoesOrdenadas.length === 0 ? (
            <div className="col-12">
              <div className="empty-state">Nenhuma seleção disponível.</div>
            </div>
          ) : (
            selecoesOrdenadas.map((selecao, index) => {
              const siteDisponivel = selecao.site && selecao.site !== '#';
              const estaSelecionada = comparados.some((c) => c.nome === selecao.nome);
              const fedValor = valorOuPadrao(selecao.federacao);

              return (
                <React.Fragment key={selecao.nome}>
                  <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
                    <article className="team-card">
                      {(selecao.bandeiraFundo || selecao.bandeira) && (
                        <img
                          src={`/${selecao.bandeiraFundo || selecao.bandeira}`}
                          className="card-flag-bg"
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                      <div className="topo-card">
                        <button
                          type="button"
                          className="escudo-zoom-button"
                          onClick={() => setModalEscudo(selecao)}
                          aria-label={`Ampliar escudo ${selecao.nome}`}
                        >
                          <img
                            src={`/${selecao.escudo}`}
                            className="escudo"
                            alt={`Escudo ${selecao.nome}`}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        </button>
                      </div>
                      <div className="card-body p-3 p-md-4 d-flex flex-column flex-grow-1">
                        <h2 className="card-title h5 mb-3">{selecao.nome}</h2>
                        <div className="info-list">
                          <div className="info-item">
                            <span className="info-label">🏆 Títulos</span>
                            <span className="info-value">{valorOuPadrao(selecao.titulos)}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">🌍 Ranking FIFA</span>
                            <span className="info-value">{valorOuPadrao(selecao.rankingFifa)}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">🎯 Participações</span>
                            <span className="info-value">{valorOuPadrao(selecao.participacoes)}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">🏢 Federação</span>
                            <span className="info-value">
                              {siteDisponivel && fedValor !== 'A confirmar' ? (
                                <a href={selecao.site} target="_blank" rel="noopener noreferrer" className="federacao-link">
                                  {selecao.federacao}
                                </a>
                              ) : (
                                fedValor
                              )}
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">🏅 Melhor Campanha</span>
                            <span
                              className="info-value text-wrap text-end"
                              style={{ maxWidth: '60%' }}
                              title={selecao.melhorCampanha}
                            >
                              {valorOuPadrao(selecao.melhorCampanha)}
                            </span>
                          </div>
                          <div className="info-item flex-column align-items-start gap-1 pb-1">
                            <span className="info-label">⭐ Destaques:</span>
                            <div className="d-flex flex-wrap gap-1 mt-1">
                              {selecao.jogadoresDestaque && selecao.jogadoresDestaque.length > 0 ? (
                                selecao.jogadoresDestaque.map((j) => (
                                  <span key={j} className="star-badge">{j}</span>
                                ))
                              ) : (
                                <span className="text-white-50 small">A confirmar</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex gap-2 mt-auto">
                          <a
                            href={siteDisponivel ? selecao.site : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-light flex-grow-1"
                            style={{
                              fontSize: '0.85rem',
                              minHeight: '38px',
                              borderRadius: '10px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              pointerEvents: siteDisponivel ? 'auto' : 'none',
                              opacity: siteDisponivel ? 1 : 0.5,
                            }}
                          >
                            Site Oficial
                          </a>
                          <button
                            type="button"
                            className={`btn ${estaSelecionada ? 'btn-success' : 'btn-primary'} btn-compare px-2`}
                            onClick={() => toggleComparar(selecao)}
                            style={{ fontSize: '0.85rem', minHeight: '38px', borderRadius: '10px', flexShrink: 0 }}
                            aria-label={`Comparar ${selecao.nome}`}
                          >
                            {estaSelecionada ? '✅ Selecionada' : '⚖️ Comparar'}
                          </button>
                        </div>
                      </div>
                    </article>
                  </div>

                  {/* Blocos de Publicidade AdSense Inline */}
                  {(index === 7 || index === 23 || index === 39) && (
                    <div className="col-12">
                      <section className="ad-slot ad-slot--inline my-2" aria-label="Espaço para anúncio entre seleções">
                        <span className="ad-slot__label">Publicidade</span>
                        <div className="ad-slot__placeholder">Espaço para Google AdSense — anúncio entre cards {index + 1}</div>
                      </section>
                    </div>
                  )}
                </React.Fragment>
              );
            })
          )}
        </div>
      </section>

      {/* Publicidade Inferior */}
      <section className="ad-slot ad-slot--footer mt-5" aria-label="Espaço para anúncio">
        <span className="ad-slot__label">Publicidade</span>
        <div className="ad-slot__placeholder">Espaço para Google AdSense — banner inferior</div>
      </section>

      {/* Modal Zoom do Escudo */}
      {modalEscudo && (
        <div className="escudo-modal is-open" role="dialog" aria-modal="true" aria-labelledby="escudo-modal-titulo">
          <div className="escudo-modal__backdrop" onClick={() => setModalEscudo(null)}></div>
          <div className="escudo-modal__content" role="document">
            <button
              type="button"
              className="escudo-modal__close"
              onClick={() => setModalEscudo(null)}
              aria-label="Fechar visualização do escudo"
            >
              &times;
            </button>
            <span className="escudo-modal__label">Escudo ampliado</span>
            <img src={`/${modalEscudo.escudo}`} alt={`Escudo ampliado ${modalEscudo.nome}`} className="escudo-modal__img" loading="lazy" decoding="async" />
            <h2 className="escudo-modal__title" id="escudo-modal-titulo">{modalEscudo.nome}</h2>
            <a
              href={`/${modalEscudo.escudo}`}
              className="btn btn-primary escudo-modal__download"
              download={`${nomeArquivoSeguro(modalEscudo.nome)}-escudo.${modalEscudo.escudo.split('.').pop()}`}
            >
              Salvar escudo
            </a>
            <div className="ad-slot ad-slot--modal mt-3" aria-label="Espaço para anúncio no modal">
              <span className="ad-slot__label">Publicidade</span>
              <div className="ad-slot__placeholder">Espaço para Google AdSense no modal</div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Comparison Bar */}
      <div className={`compare-bar ${comparados.length > 0 ? 'is-visible' : ''}`} aria-hidden={comparados.length === 0}>
        <div className="container d-flex align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3 overflow-x-auto py-1">
            <span className="compare-bar__title text-nowrap">⚖️ Comparar:</span>
            <div id="compare-selected-list" className="d-flex gap-2 align-items-center">
              {comparados.map((s) => (
                <div className="compare-badge" key={s.nome}>
                  <img
                    src={`/${s.bandeiraQuadrada || s.bandeira || s.escudo}`}
                    alt=""
                    style={{ width: '18px', height: '18px', objectFit: 'contain' }}
                    loading="lazy"
                    decoding="async"
                  />
                  <span>{s.nome}</span>
                  <span className="compare-badge__remove" onClick={() => removerComparado(s.nome)}>&times;</span>
                </div>
              ))}
            </div>
          </div>
          <div className="d-flex align-items-center gap-2 text-nowrap">
            <button type="button" className="btn btn-sm btn-outline-light px-3 py-1" style={{ borderRadius: '10px' }} onClick={limparComparados}>
              Limpar
            </button>
            <button
              type="button"
              className="btn btn-sm btn-primary px-3 py-1"
              style={{ borderRadius: '10px' }}
              disabled={comparados.length !== 2}
              onClick={() => setModalCompareOpen(true)}
            >
              Comparar
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {modalCompareOpen && t1 && t2 && (
        <div className="compare-modal is-open" role="dialog" aria-modal="true" aria-labelledby="compare-modal-title">
          <div className="compare-modal__backdrop" onClick={() => setModalCompareOpen(false)}></div>
          <div className="compare-modal__content" role="document">
            <button
              type="button"
              className="compare-modal__close"
              onClick={() => setModalCompareOpen(false)}
              aria-label="Fechar comparação"
            >
              &times;
            </button>
            <h2 className="compare-modal__title h4" id="compare-modal-title">⚖️ Comparação de Seleções</h2>

            <div className="compare-grid mt-4">
              {/* Seleção 1 */}
              <div className="compare-team compare-team--1">
                <div className="compare-team__escudo-wrapper">
                  <img src={`/${t1.escudo}`} alt={`Escudo de ${t1.nome}`} className="compare-team__escudo" decoding="async" />
                </div>
                <h3 className="compare-team__name h5">{t1.nome}</h3>
                <span className="badge bg-light text-dark">{t1.confederacao || 'Federação'}</span>
              </div>

              {/* Estatísticas Centrais */}
              <div className="compare-stats">
                {/* Títulos Mundiais */}
                <div className="compare-stat-row">
                  <div className="compare-stat-label">🏆 Títulos Mundiais</div>
                  <div className="compare-stat-values">
                    <span>{t1.titulos || 0}</span>
                    <span>{t2.titulos || 0}</span>
                  </div>
                  <div className="compare-bar-container">
                    <div className="compare-progress compare-progress--1" style={{ width: `${pctTit1}%` }}></div>
                    <div className="compare-progress compare-progress--2" style={{ width: `${pctTit2}%` }}></div>
                  </div>
                </div>

                {/* Ranking FIFA */}
                <div className="compare-stat-row">
                  <div className="compare-stat-label">🌍 Ranking FIFA</div>
                  <div className="compare-stat-values">
                    <span>{valorOuPadrao(t1.rankingFifa)}</span>
                    <span>{valorOuPadrao(t2.rankingFifa)}</span>
                  </div>
                  <div className="compare-bar-container">
                    <div className="compare-progress compare-progress--1" style={{ width: `${pctRank1}%` }}></div>
                    <div className="compare-progress compare-progress--2" style={{ width: `${pctRank2}%` }}></div>
                  </div>
                </div>

                {/* Participações */}
                <div className="compare-stat-row">
                  <div className="compare-stat-label">🎯 Participações em Copas</div>
                  <div className="compare-stat-values">
                    <span>{t1.participacoes || 0}</span>
                    <span>{t2.participacoes || 0}</span>
                  </div>
                  <div className="compare-bar-container">
                    <div className="compare-progress compare-progress--1" style={{ width: `${pctPart1}%` }}></div>
                    <div className="compare-progress compare-progress--2" style={{ width: `${pctPart2}%` }}></div>
                  </div>
                </div>

                {/* Federação */}
                <div className="compare-stat-row">
                  <div className="compare-stat-label">🏢 Federação</div>
                  <div className="compare-stat-values-text mt-1">
                    <span className="text-start">{t1.federacao || '—'}</span>
                    <span className="text-end">{t2.federacao || '—'}</span>
                  </div>
                </div>

                {/* Melhor Campanha */}
                <div className="compare-stat-row">
                  <div className="compare-stat-label">🏅 Melhor Campanha</div>
                  <div className="compare-stat-values-text mt-1">
                    <span className="text-start text-wrap" style={{ maxWidth: '48%' }}>{t1.melhorCampanha || 'A confirmar'}</span>
                    <span className="text-end text-wrap" style={{ maxWidth: '48%' }}>{t2.melhorCampanha || 'A confirmar'}</span>
                  </div>
                </div>
              </div>

              {/* Seleção 2 */}
              <div className="compare-team compare-team--2">
                <div className="compare-team__escudo-wrapper">
                  <img src={`/${t2.escudo}`} alt={`Escudo de ${t2.nome}`} className="compare-team__escudo" decoding="async" />
                </div>
                <h3 className="compare-team__name h5">{t2.nome}</h3>
                <span className="badge bg-light text-dark">{t2.confederacao || 'Federação'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
