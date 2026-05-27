import React, { useState, useEffect } from 'react';
import Countdown from '../components/Countdown';

export default function Groups() {
  const [grupos, setGrupos] = useState([]);
  const [chaveamento, setChaveamento] = useState({});
  const [faseAtivaIndex, setFaseAtivaIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const etapas = ['dezesseis_avos', 'oitavas', 'quartas', 'semifinais', 'final'];

  const tituloEtapa = (chave) => {
    const nomes = {
      dezesseis_avos: 'Dezesseis-avos',
      oitavas: 'Oitavas de Final',
      quartas: 'Quartas de Final',
      semifinais: 'Semifinais',
      final: 'Finais',
    };
    return nomes[chave] || chave;
  };

  useEffect(() => {
    fetch('/data/grupos.json')
      .then((res) => res.json())
      .then((data) => {
        setGrupos(data.grupos || []);
        setChaveamento(data.chaveamento || {});
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar dados de grupos:', err);
        setLoading(false);
      });
  }, []);

  const totalSelecoes = grupos.reduce((acc, g) => acc + (g.selecoes || []).length, 0);

  const activeEtapa = etapas[faseAtivaIndex];
  const activeJogos = chaveamento[activeEtapa] || [];
  const gridClass = activeJogos.length > 4 ? 'grid-2col' : '';

  return (
    <main className="container pb-5">
      {/* Hero / Introdução */}
      <section className="hero mb-4">
        <div className="row align-items-center g-0">
          <div className="col-lg-8 hero-content p-4 p-md-5 position-relative">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <span className="hero-badge">📊 Tabela da competição</span>
              <Countdown />
            </div>
            <h1>Grupos e chaveamento</h1>
            <p>Visualização preparada para acompanhar grupos, pontuação e fases eliminatórias da Copa do Mundo 2026.</p>
            <div className="row g-3 mt-3">
              <div className="col-6 col-md-3">
                <div className="stat-card">
                  <span className="stat-number">{loading ? '—' : grupos.length}</span>
                  <span className="stat-label">grupos</span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="stat-card">
                  <span className="stat-number">{loading ? '—' : totalSelecoes}</span>
                  <span className="stat-label">seleções</span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="stat-card">
                  <span className="stat-number">32</span>
                  <span className="stat-label">classificadas ao mata-mata</span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="stat-card">
                  <span className="stat-number">1</span>
                  <span className="stat-label">campeã</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 text-center p-4 p-md-5 position-relative">
            <img src="/assets/copa-2026-logo.svg" className="hero-logo" alt="Logo da Copa do Mundo FIFA 2026" />
          </div>
        </div>
      </section>

      {/* Informativo */}
      <div className="notice mb-4">
        Os grupos e o chaveamento estão estruturados em <strong>data/grupos.json</strong> para facilitar atualização. Como a consulta online à página da FIFA não está disponível neste ambiente, os dados foram organizados como base demonstrativa usando as 48 seleções do projeto.
      </div>

      {/* AdSense Superior */}
      <section className="ad-slot ad-slot--hero mb-4" aria-label="Espaço para anúncio">
        <span className="ad-slot__label">Publicidade</span>
        <div className="ad-slot__placeholder">Espaço estratégico para Google AdSense — página de grupos</div>
      </section>

      {/* Seção: Fase de Grupos */}
      <section className="mb-5">
        <div className="d-flex align-items-end justify-content-between gap-3 mb-3">
          <div>
            <span className="hero-badge">🏟️ Fase de grupos</span>
            <h2 className="mt-2 mb-0">Classificação por grupo</h2>
          </div>
        </div>
        <div className="row g-3 g-md-4" id="lista-grupos">
          {loading ? (
            <div className="col-12">
              <div className="empty-state">Carregando grupos...</div>
            </div>
          ) : (
            grupos.map((grupo) => (
              <div className="col-12 col-lg-6 col-xxl-4" key={grupo.grupo}>
                <article className="group-card">
                  <div className="group-header">
                    <h2 className="group-title">{grupo.grupo}</h2>
                    <span className="badge rounded-pill text-bg-light">4 seleções</span>
                  </div>
                  <div className="team-row header">
                    <span></span>
                    <span>Seleção</span>
                    <span>Pts</span>
                    <span>J</span>
                    <span>V</span>
                    <span>SG</span>
                  </div>
                  {grupo.selecoes &&
                    grupo.selecoes.map((time, idx) => (
                      <div className="team-row" key={time.nome}>
                        <img
                          src={`/${time.bandeiraQuadrada || time.bandeira || time.escudo}`}
                          className="team-mini"
                          alt={`Bandeira ${time.nome}`}
                          loading="lazy"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <span className="team-name">{idx + 1}. {time.nome}</span>
                        <span className="stand-cell">{time.pontos ?? 0}</span>
                        <span className="stand-cell">{time.jogos ?? 0}</span>
                        <span className="stand-cell">{time.vitorias ?? 0}</span>
                        <span className="stand-cell">{time.saldo ?? 0}</span>
                      </div>
                    ))}
                </article>
              </div>
            ))
          )}
        </div>
      </section>

      {/* AdSense Intermediário */}
      <section className="ad-slot ad-slot--inline mb-5" aria-label="Espaço para anúncio">
        <span className="ad-slot__label">Publicidade</span>
        <div className="ad-slot__placeholder">Espaço para Google AdSense entre grupos e chaveamento</div>
      </section>

      {/* Seção: Mata-Mata */}
      <section className="mb-5">
        <div className="d-flex align-items-end justify-content-between gap-3 mb-3">
          <div>
            <span className="hero-badge">⚔️ Mata-mata</span>
            <h2 className="mt-2 mb-0">Chaveamento</h2>
          </div>
        </div>

        {/* Chaveamento Carousel Controls */}
        <div className="bracket-carousel-controls d-flex align-items-center justify-content-between mb-4 p-2">
          <button
            type="button"
            className="btn btn-outline-light btn-carousel-nav"
            onClick={() => setFaseAtivaIndex((prev) => Math.max(prev - 1, 0))}
            disabled={faseAtivaIndex === 0}
            aria-label="Fase anterior"
          >
            &lsaquo; <span className="d-none d-sm-inline ms-1">Anterior</span>
          </button>
          <div className="bracket-carousel-indicators d-flex gap-1 gap-md-2" id="carousel-indicators">
            {etapas.map((etapa, idx) => (
              <button
                key={etapa}
                type="button"
                className={`indicator-pill ${idx === faseAtivaIndex ? 'active' : ''}`}
                onClick={() => setFaseAtivaIndex(idx)}
              >
                {tituloEtapa(etapa)}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-outline-light btn-carousel-nav"
            onClick={() => setFaseAtivaIndex((prev) => Math.min(prev + 1, etapas.length - 1))}
            disabled={faseAtivaIndex === etapas.length - 1}
            aria-label="Próxima fase"
          >
            <span className="d-none d-sm-inline me-1">Próxima</span> &rsaquo;
          </button>
        </div>

        {/* Chaveamento Ativo */}
        <div className="bracket-carousel-container" id="chaveamento">
          {loading ? (
            <div className="bracket-column">
              <div className="empty-state">Carregando chaveamento...</div>
            </div>
          ) : (
            <div className="bracket-column active">
              <section className="bracket-card p-3 p-md-4">
                <h2 className="bracket-stage-title h5 text-center pb-2 mb-3 border-bottom border-light-subtle">
                  {tituloEtapa(activeEtapa)}
                </h2>
                <div className={`matches-list ${gridClass}`}>
                  {activeJogos.map((jogo, jIdx) => (
                    <div className="match" key={`${activeEtapa}-j-${jIdx}`}>
                      <div className="match-label">{jogo.jogo}</div>
                      <div className="match-team">
                        <span>{jogo.timeA}</span>
                        <strong>—</strong>
                      </div>
                      <div className="match-team">
                        <span>{jogo.timeB}</span>
                        <strong>—</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </section>

      {/* Estádios */}
      <section className="mt-5 mb-4">
        <div className="d-flex align-items-end justify-content-between gap-3 mb-3">
          <div>
            <span className="hero-badge">🏟️ Estádios da Copa</span>
            <h2 className="mt-2 mb-0">Principais Estádios e Cidades-Sede</h2>
          </div>
        </div>

        <div className="row g-3 g-md-4">
          {/* Azteca */}
          <div className="col-12 col-md-6 col-lg-4">
            <article className="stadium-card">
              <div className="stadium-img-wrapper" style={{ backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.95)), linear-gradient(135deg, rgba(19,196,99,0.3), rgba(4,72,43,0.8))" }}>
                <span className="stadium-country-badge">🇲🇽 México</span>
                <div className="stadium-info-overlay">
                  <h3 className="stadium-name h5 mb-1">Estádio Azteca</h3>
                  <p className="stadium-city mb-0">Cidade do México</p>
                </div>
              </div>
              <div className="stadium-details p-3">
                <div className="stadium-detail-item">
                  <strong>Capacidade:</strong> <span>87.523 espectadores</span>
                </div>
                <div className="stadium-detail-item">
                  <strong>Fato Histórico:</strong> <span>Primeiro estádio a receber três Copas do Mundo (1970, 1986, 2026).</span>
                </div>
              </div>
            </article>
          </div>

          {/* MetLife */}
          <div className="col-12 col-md-6 col-lg-4">
            <article className="stadium-card">
              <div className="stadium-img-wrapper" style={{ backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.95)), linear-gradient(135deg, rgba(0,183,255,0.3), rgba(23,76,255,0.8))" }}>
                <span className="stadium-country-badge">🇺🇸 EUA</span>
                <div className="stadium-info-overlay">
                  <h3 className="stadium-name h5 mb-1">MetLife Stadium</h3>
                  <p className="stadium-city mb-0">Nova York / Nova Jersey</p>
                </div>
              </div>
              <div className="stadium-details p-3">
                <div className="stadium-detail-item">
                  <strong>Capacidade:</strong> <span>82.500 espectadores</span>
                </div>
                <div className="stadium-detail-item">
                  <strong>Fato Histórico:</strong> <span>Será o palco da Grande Final no dia 19 de Julho de 2026.</span>
                </div>
              </div>
            </article>
          </div>

          {/* BC Place */}
          <div className="col-12 col-md-6 col-lg-4">
            <article className="stadium-card">
              <div className="stadium-img-wrapper" style={{ backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.95)), linear-gradient(135deg, rgba(255,212,57,0.25), rgba(19,196,99,0.7))" }}>
                <span className="stadium-country-badge">🇨🇦 Canadá</span>
                <div className="stadium-info-overlay">
                  <h3 className="stadium-name h5 mb-1">BC Place</h3>
                  <p className="stadium-city mb-0">Vancouver</p>
                </div>
              </div>
              <div className="stadium-details p-3">
                <div className="stadium-detail-item">
                  <strong>Capacidade:</strong> <span>54.500 espectadores</span>
                </div>
                <div className="stadium-detail-item">
                  <strong>Fato Histórico:</strong> <span>Principal estádio canadense no torneio, famoso pelo teto retrátil.</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
