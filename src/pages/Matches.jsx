import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Countdown from '../components/Countdown';
import { buscarResultadosReais } from '../utils/soccerApi';
import { carregarPartidasAtualizadas, salvarPartidasAtualizadas } from '../utils/predictionStorage';

export default function Matches() {
  const [partidas, setPartidas] = useState([]);
  const [filtroGrupo, setFiltroGrupo] = useState('todos');
  const [filtroRodada, setFiltroRodada] = useState('todas');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // 1. Carrega dados atualizados do cache offline do localStorage primeiro, se houver
    const localCachedMatches = carregarPartidasAtualizadas();
    
    const carregarEIntegrarAPI = (baseMatches) => {
      buscarResultadosReais()
        .then((resultadosReais) => {
          if (resultadosReais && resultadosReais.length > 0) {
            const updated = baseMatches.map((partida) => {
              // Procura se essa partida já encerrou na API
              const resultadoApi = resultadosReais.find((res) => 
                (res.selecaoA === partida.selecaoA && res.selecaoB === partida.selecaoB) ||
                (res.selecaoA === partida.selecaoB && res.selecaoB === partida.selecaoA)
              );

              if (resultadoApi) {
                const golsRealA = resultadoApi.selecaoA === partida.selecaoA ? resultadoApi.golsA : resultadoApi.golsB;
                const golsRealB = resultadoApi.selecaoA === partida.selecaoA ? resultadoApi.golsB : resultadoApi.golsA;
                return {
                  ...partida,
                  golsRealA,
                  golsRealB,
                  encerrada: true
                };
              }
              return partida;
            });
            setPartidas(updated);
            salvarPartidasAtualizadas(updated);
          } else {
            setPartidas(baseMatches);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Erro ao sincronizar partidas com a API:', err);
          setPartidas(baseMatches);
          setLoading(false);
        });
    };

    if (localCachedMatches && localCachedMatches.length > 0) {
      setPartidas(localCachedMatches);
      setLoading(false);
      // Busca atualizações adicionais da API em background
      carregarEIntegrarAPI(localCachedMatches);
    } else {
      fetch('/data/partidas.json')
        .then((res) => res.json())
        .then((data) => {
          const baseData = data || [];
          // Tenta integrar com a API
          carregarEIntegrarAPI(baseData);
        })
        .catch((err) => {
          console.error('Erro ao carregar partidas estáticas:', err);
          setLoading(false);
        });
    }
  }, []);

  const handlePalpitar = (partidaId) => {
    // Guarda na sessionStorage como fallback para compatibilidade ou suporte geral
    sessionStorage.setItem('pre_selected_match_id', partidaId);
    navigate('/palpites', { state: { preSelectedMatchId: partidaId } });
  };

  const partidasFiltradas = partidas.filter((p) => {
    const matchesGrupo = filtroGrupo === 'todos' || p.grupo === filtroGrupo;
    const matchesRodada = filtroRodada === 'todas' || p.rodada === parseInt(filtroRodada);
    return matchesGrupo && matchesRodada;
  });


  return (
    <main className="container pb-5">
      {/* Hero / Introdução */}
      <section className="hero mb-4">
        <div className="row align-items-center g-0">
          <div className="col-lg-8 hero-content p-4 p-md-5 position-relative">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <span className="hero-badge">🏟️ Partidas</span>
              <Countdown />
            </div>
            <h1>Confrontos da Primeira Fase</h1>
            <p>Acompanhe a tabela de jogos das 48 seleções divididas nos grupos da Copa do Mundo 2026.</p>
          </div>
          <div className="col-lg-4 text-center p-4 p-md-5 position-relative">
            <img src="/assets/copa-2026-logo.svg" className="hero-logo" alt="Logo da Copa do Mundo FIFA 2026" />
          </div>
        </div>
      </section>

      {/* Publicidade Superior */}
      <section className="ad-slot mb-4" aria-label="Espaço para anúncio">
        <span className="ad-slot__label">Publicidade</span>
        <div className="ad-slot__placeholder">Espaço estratégico para Google AdSense — banner horizontal superior</div>
      </section>

      {/* Barra de Filtros */}
      <section className="toolbar p-3 p-md-4 mb-4">
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label htmlFor="filtro-grupo" className="form-label small text-white-50 mb-1">Filtrar por Grupo</label>
            <select
              id="filtro-grupo"
              className="form-select"
              value={filtroGrupo}
              onChange={(e) => setFiltroGrupo(e.target.value)}
            >
              <option value="todos">Todos os grupos</option>
              <option value="A">Grupo A</option>
              <option value="B">Grupo B</option>
              <option value="C">Grupo C</option>
              <option value="D">Grupo D</option>
              <option value="E">Grupo E</option>
              <option value="F">Grupo F</option>
              <option value="G">Grupo G</option>
              <option value="H">Grupo H</option>
              <option value="I">Grupo I</option>
              <option value="J">Grupo J</option>
              <option value="K">Grupo K</option>
              <option value="L">Grupo L</option>
            </select>
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="filtro-rodada" className="form-label small text-white-50 mb-1">Filtrar por Rodada</label>
            <select
              id="filtro-rodada"
              className="form-select"
              value={filtroRodada}
              onChange={(e) => setFiltroRodada(e.target.value)}
            >
              <option value="todas">Todas as rodadas</option>
              <option value="1">Rodada 1</option>
              <option value="2">Rodada 2</option>
              <option value="3">Rodada 3</option>
            </select>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <span id="contador-confrontos" className="badge rounded-pill text-bg-light px-3 py-2">
              {loading ? 'Carregando partidas...' : `${partidasFiltradas.length} confrontos encontrados`}
            </span>
          </div>
        </div>
      </section>

      {/* Lista de Confrontos */}
      <section>
        <div className="row g-3 g-md-4" id="lista-confrontos">
          {loading ? (
            <div className="col-12">
              <div className="empty-state">Carregando confrontos...</div>
            </div>
          ) : partidasFiltradas.length === 0 ? (
            <div className="col-12">
              <div className="empty-state">Nenhum confronto correspondente aos filtros selecionados.</div>
            </div>
          ) : (
            partidasFiltradas.map((partida) => (
              <div className="col-12 col-lg-6" key={partida.id}>
                <article className="match-picker-card p-3 mb-2">
                  <div className="match-card-vs">
                    {/* Seleção A */}
                    <div className="match-card-team">
                      <div className="match-card-escudo-wrapper" style={{ width: '70px', height: '70px', borderRadius: '18px' }}>
                        <img
                          src={`/${partida.escudoA}`}
                          alt={`Escudo de ${partida.selecaoA}`}
                          className="match-card-escudo"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => { e.currentTarget.src = '/assets/copa-2026-logo-white.svg'; }}
                        />
                      </div>
                      <h3 className="match-card-team-name mt-2" style={{ fontSize: '1rem' }}>{partida.selecaoA}</h3>
                    </div>

                    {/* Centro */}
                    <div className="match-card-center-vs d-flex flex-column align-items-center justify-content-center">
                      <span className="match-card-badge mb-1" style={{ fontSize: '0.7rem' }}>
                        Grupo {partida.grupo} — Rodada {partida.rodada}
                      </span>
                      {partida.encerrada ? (
                        <>
                          <span className="match-card-vs-text text-success font-weight-bold my-1" style={{ fontSize: '1.55rem', letterSpacing: '2px' }}>
                            {partida.golsRealA} - {partida.golsRealB}
                          </span>
                          <span className="badge px-2 py-1 my-1" style={{ fontSize: '0.62rem', background: 'rgba(0, 200, 83, 0.15)', color: '#00C853', border: '1px solid rgba(0, 200, 83, 0.3)', borderRadius: '6px' }}>
                            Resultado Oficial
                          </span>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm px-3 mt-2"
                            disabled
                            style={{ fontSize: '0.78rem', minHeight: '32px', borderRadius: '8px', cursor: 'not-allowed', opacity: 0.5 }}
                          >
                            Encerrado 🔒
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="match-card-vs-text" style={{ fontSize: '1.4rem' }}>VS</span>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm px-3 mt-2"
                            onClick={() => handlePalpitar(partida.id)}
                            style={{ fontSize: '0.78rem', minHeight: '32px', borderRadius: '8px' }}
                          >
                            Palpitar 🎮
                          </button>
                        </>
                      )}
                    </div>

                    {/* Seleção B */}
                    <div className="match-card-team">
                      <div className="match-card-escudo-wrapper" style={{ width: '70px', height: '70px', borderRadius: '18px' }}>
                        <img
                          src={`/${partida.escudoB}`}
                          alt={`Escudo de ${partida.selecaoB}`}
                          className="match-card-escudo"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => { e.currentTarget.src = '/assets/copa-2026-logo-white.svg'; }}
                        />
                      </div>
                      <h3 className="match-card-team-name mt-2" style={{ fontSize: '1rem' }}>{partida.selecaoB}</h3>
                    </div>
                  </div>
                </article>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Publicidade Inferior */}
      <section className="ad-slot mt-5" aria-label="Espaço para anúncio">
        <span className="ad-slot__label">Publicidade</span>
        <div className="ad-slot__placeholder">Espaço para Google AdSense — banner inferior</div>
      </section>
    </main>
  );
}
