import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Countdown from '../components/Countdown';

// Subcomponentes de UI
import PredictionSteps from '../components/predictions/PredictionSteps';
import MatchPicker from '../components/predictions/MatchPicker';
import PredictionModeSelector from '../components/predictions/PredictionModeSelector';
import PredictionQuiz from '../components/predictions/PredictionQuiz';
import PredictionResult from '../components/predictions/PredictionResult';
import PredictionFinalForm from '../components/predictions/PredictionFinalForm';
import PredictionStats from '../components/predictions/PredictionStats';
import PredictionAchievements from '../components/predictions/PredictionAchievements';
import PredictionHistory from '../components/predictions/PredictionHistory';

// Utilitários de lógica, armazenamento e compartilhamento
import { carregarPalpites, salvarPalpite, limparTodosPalpites, carregarPartidasAtualizadas, salvarPartidasAtualizadas } from '../utils/predictionStorage';
import { buscarResultadosReais } from '../utils/soccerApi';
import { 
  getPerguntasRapidas, 
  getPerguntasDetalhadas, 
  calcularPontuacao, 
  calcularNivelConfianca, 
  gerarDescricaoResultado 
} from '../utils/predictionScore';
import { gerarPerfilPalpiteiro } from '../utils/predictionProfile';
import { 
  gerarFraseCompartilhamento, 
  desenharCardPNG, 
  desenharRetanguloArredondado, 
  desenharImagemArredondada,
  codigoParaEmojiBandeira 
} from '../utils/predictionShare';
import AdBlock from '../components/AdBlock';

export default function Predictions() {
  const [partidas, setPartidas] = useState([]);
  const [selecoes, setSelecoes] = useState([]);
  const [partidaId, setPartidaId] = useState('');
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // Modo de Palpite: '' | 'rapido' | 'detalhado'
  const [tipoPalpite, setTipoPalpite] = useState('');

  // Respostas estruturadas do questionário
  const [respostas, setRespostas] = useState({});

  // Estados da Sugestão e Palpite Final
  const [sugestao, setSugestao] = useState(null);
  const [palpiteFinal, setPalpiteFinal] = useState('');
  const [placarA, setPlacarA] = useState('');
  const [placarB, setPlacarB] = useState('');

  // Histórico local e status de salvamento
  const [palpitesSalvos, setPalpitesSalvos] = useState([]);
  const [palpiteSalvoSucesso, setPalpiteSalvoSucesso] = useState(false);

  // Carregar dados iniciais das partidas e seleções com background sync
  useEffect(() => {
    const localCachedMatches = carregarPartidasAtualizadas();

    const carregarEIntegrarAPI = (baseMatches, selecoesData) => {
      buscarResultadosReais()
        .then((resultadosReais) => {
          if (resultadosReais && resultadosReais.length > 0) {
            const updated = baseMatches.map((partida) => {
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
          setSelecoes(selecoesData || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Erro ao sincronizar partidas com a API:', err);
          setPartidas(baseMatches);
          setSelecoes(selecoesData || []);
          setLoading(false);
        });
    };

    Promise.all([
      fetch('/data/partidas.json').then((r) => r.json()),
      fetch('/data/selecoes.json').then((r) => r.json()),
    ])
      .then(([partidasData, selecoesData]) => {
        const baseMatches = localCachedMatches && localCachedMatches.length > 0 ? localCachedMatches : (partidasData || []);
        if (localCachedMatches && localCachedMatches.length > 0) {
          setPartidas(localCachedMatches);
          setSelecoes(selecoesData.copa_2026 || []);
          setLoading(false);
          // Busca atualizações da API em background
          carregarEIntegrarAPI(localCachedMatches, selecoesData.copa_2026);
        } else {
          carregarEIntegrarAPI(baseMatches, selecoesData.copa_2026);
        }
      })
      .catch((err) => {
        console.error('Erro ao carregar dados:', err);
        setLoading(false);
      });

    setPalpitesSalvos(carregarPalpites());
  }, []);

  // Verificar se há partida pré-selecionada na navegação ou sessionStorage
  useEffect(() => {
    if (partidas.length > 0) {
      const stateMatchId = location.state?.preSelectedMatchId;
      const sessionMatchId = sessionStorage.getItem('pre_selected_match_id');
      const matchIdToSelect = stateMatchId || sessionMatchId;

      if (matchIdToSelect) {
        setPartidaId(matchIdToSelect);
        sessionStorage.removeItem('pre_selected_match_id');
      }
    }
  }, [partidas, location]);

  const partidaAtual = partidas.find((p) => p.id === partidaId);

  // Resetar estados ao mudar de partida
  useEffect(() => {
    setTipoPalpite('');
    setRespostas({});
    setSugestao(null);
    setPalpiteFinal('');
    if (partidaAtual && partidaAtual.encerrada) {
      setPlacarA(partidaAtual.golsRealA !== undefined ? partidaAtual.golsRealA.toString() : '');
      setPlacarB(partidaAtual.golsRealB !== undefined ? partidaAtual.golsRealB.toString() : '');
      setPalpiteFinal(partidaAtual.golsRealA > partidaAtual.golsRealB ? partidaAtual.selecaoA : partidaAtual.golsRealB > partidaAtual.golsRealA ? partidaAtual.selecaoB : 'Empate');
    } else {
      setPlacarA('');
      setPlacarB('');
    }
    setPalpiteSalvoSucesso(false);
  }, [partidaId, partidaAtual]);

  // Perguntas dinâmicas baseadas no tipo de palpite selecionado
  const perguntasAtuais =
    tipoPalpite === 'rapido'
      ? getPerguntasRapidas(partidaAtual || {})
      : tipoPalpite === 'detalhado'
      ? getPerguntasDetalhadas(partidaAtual || {})
      : [];

  const handleRespostaChange = (perguntaId, valor) => {
    setRespostas((prev) => ({ ...prev, [perguntaId]: valor }));
  };

  const handleTrocarTipo = () => {
    setTipoPalpite('');
    setRespostas({});
    setSugestao(null);
    setPalpiteFinal('');
    setPlacarA('');
    setPlacarB('');
    setPalpiteSalvoSucesso(false);
  };

  const handleCalcularSugestao = () => {
    if (!partidaAtual || perguntasAtuais.length === 0) return;

    const pontuacao = calcularPontuacao(respostas, perguntasAtuais);
    const nivelConfianca = calcularNivelConfianca(pontuacao, tipoPalpite);
    const descricao = gerarDescricaoResultado(pontuacao, partidaAtual, respostas, tipoPalpite);

    let resultadoSugerido = 'Empate';
    if (pontuacao.pontosA > pontuacao.pontosB && pontuacao.pontosA > pontuacao.pontosEmpate) {
      resultadoSugerido = partidaAtual.selecaoA;
    } else if (pontuacao.pontosB > pontuacao.pontosA && pontuacao.pontosB > pontuacao.pontosEmpate) {
      resultadoSugerido = partidaAtual.selecaoB;
    }

    const novaSugestao = {
      resultadoSugerido,
      descricao,
      pontosA: pontuacao.pontosA,
      pontosB: pontuacao.pontosB,
      pontosEmpate: pontuacao.pontosEmpate,
      nivelConfianca,
      totalPerguntas: perguntasAtuais.length
    };

    setSugestao(novaSugestao);
    setPalpiteFinal(resultadoSugerido);

    setTimeout(() => {
      document.getElementById('secao-resultado-sugerido')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSalvarPalpite = (e) => {
    e.preventDefault();
    if (!partidaAtual || !sugestao) return;

    if (palpiteFinal === '') {
      alert('Por favor, selecione o seu palpite final.');
      return;
    }
    if (placarA === '' || placarB === '') {
      alert('Por favor, preencha o placar do jogo.');
      return;
    }

    // Gerar perfil do palpiteiro antes de salvar
    const perfilCalculado = gerarPerfilPalpiteiro(respostas, palpiteFinal, sugestao, partidaAtual);

    const palpite = {
      matchId: partidaAtual.id,
      grupo: partidaAtual.grupo,
      rodada: partidaAtual.rodada,
      selecaoA: partidaAtual.selecaoA,
      selecaoB: partidaAtual.selecaoB,
      tipoPalpite,
      respostas: { ...respostas },
      pontuacao: {
        selecaoA: sugestao.pontosA,
        empate: sugestao.pontosEmpate,
        selecaoB: sugestao.pontosB,
      },
      nivelConfianca: sugestao.nivelConfianca,
      perfilPalpiteiro: perfilCalculado,
      totalPerguntas: sugestao.totalPerguntas,
      resultadoSugerido: sugestao.resultadoSugerido,
      palpiteFinal,
      placar: {
        selecaoA: parseInt(placarA),
        selecaoB: parseInt(placarB),
      },
      createdAt: new Date().toISOString(),
    };

    const sucesso = salvarPalpite(palpite);
    if (sucesso) {
      setPalpitesSalvos(carregarPalpites());
      setPalpiteSalvoSucesso(true);
      alert(`Palpite para ${partidaAtual.selecaoA} x ${partidaAtual.selecaoB} salvo com sucesso!`);
      
      setTimeout(() => {
        document.getElementById('secao-historico')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      alert('Infelizmente ocorreu um erro ao salvar o palpite.');
    }
  };

  const handleLimparPalpites = () => {
    if (window.confirm('Tem certeza de que deseja limpar todos os seus palpites salvos?')) {
      limparTodosPalpites();
      setPalpitesSalvos(carregarPalpites());
      alert('Histórico de palpites limpo com sucesso!');
    }
  };

  const formatarNomeSelecaoParaTexto = (nome) => {
    if (nome === "República Tcheca") return "Rep. Tcheca";
    if (nome === "Bósnia e Herzegovina") return "Bósnia";
    return nome;
  };

  const gerarTextoPalpites = () => {
    if (palpitesSalvos.length === 0) return "";
    const copia = [...palpitesSalvos].sort((a, b) => a.grupo.localeCompare(b.grupo) || a.rodada - b.rodada);

    let texto = "🏆 MEUS PALPITES — COPA 2026 🏆\n";
    texto += "Ganhe de mim se for capaz! 😉👇\n\n";

    let grupoRodadaAtual = "";

    copia.forEach((p) => {
      const key = `⚽ GRUPO ${p.grupo} (Rodada ${p.rodada})`;
      if (key !== grupoRodadaAtual) {
        if (grupoRodadaAtual !== "") {
          texto += "\n";
        }
        texto += `${key}\n`;
        grupoRodadaAtual = key;
      }
      const nomeA = formatarNomeSelecaoParaTexto(p.selecaoA);
      const nomeB = formatarNomeSelecaoParaTexto(p.selecaoB);
      texto += `${nomeA} ${p.placar.selecaoA} x ${p.placar.selecaoB} ${nomeB}\n`;
    });

    let siteUrl = window.location.href.split('?')[0].split('#')[0];
    if (window.location.protocol === 'file:') {
      siteUrl = "copa2026palpites.com/palpites";
    }
    texto += `\n👉 Monte seus palpites e monte seu grupo também:\n🔗 ${siteUrl}`;
    return texto;
  };

  const baixarPalpitesComoTexto = () => {
    const texto = gerarTextoPalpites();
    if (!texto) return;
    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `meus-palpites-copa2026.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const compartilharNoWhatsApp = () => {
    // Se o usuário clicar no botão geral de compartilhar todos os palpites
    const texto = gerarTextoPalpites();
    if (!texto) return;
    const urlShare = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(urlShare, '_blank');
  };

  const exportarPalpitesJSON = () => {
    if (palpitesSalvos.length === 0) {
      alert("Nenhum palpite para exportar.");
      return;
    }
    const dataStr = JSON.stringify(palpitesSalvos, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `palpites-copa2026.json`;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const compartilharPalpiteUnicoWhatsApp = (palpite) => {
    // Compartilha apenas o palpite específico utilizando o formato aprimorado
    const frase = gerarFraseCompartilhamento(palpite);
    const urlShare = `https://api.whatsapp.com/send?text=${encodeURIComponent(frase)}`;
    window.open(urlShare, '_blank');
  };

  const iniciarDownload = (url, palpite, layout) => {
    const slugName = (n) => n.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const suffix = layout === 'stories' ? '-stories' : '-card';
    link.setAttribute("download", `palpite-${slugName(palpite.selecaoA)}-vs-${slugName(palpite.selecaoB)}${suffix}.png`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const gerarImagemCardPalpite = (matchId, tPalpite, layout = 'square') => {
    const palpite = palpitesSalvos.find((p) => p.matchId === matchId && p.tipoPalpite === tPalpite);
    if (!palpite) return;

    const partidaInfo = partidas.find((p) => p.id === matchId);
    const bandeiraA = partidaInfo ? partidaInfo.bandeiraA : '';
    const bandeiraB = partidaInfo ? partidaInfo.bandeiraB : '';

    const carregarImagem = (src) => {
      return new Promise((resolve) => {
        if (!src) return resolve(null);
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = `/${src}`;
      });
    };

    Promise.all([carregarImagem(bandeiraA), carregarImagem(bandeiraB)]).then(([imgA, imgB]) => {
      const canvas = document.createElement('canvas');
      const isStories = layout === 'stories';
      canvas.width = isStories ? 1080 : 800;
      canvas.height = isStories ? 1920 : 800;
      const ctx = canvas.getContext('2d');

      try {
        desenharCardPNG(ctx, imgA, imgB, palpite, selecoes, layout);
        const url = canvas.toDataURL('image/png');
        iniciarDownload(url, palpite, layout);
      } catch (err) {
        console.warn("Falha de CORS/Taint com arquivos SVG. Utilizando fallback de emojis para o card...", err);
        const canvasFallback = document.createElement('canvas');
        canvasFallback.width = isStories ? 1080 : 800;
        canvasFallback.height = isStories ? 1920 : 800;
        const ctxFallback = canvasFallback.getContext('2d');
        
        desenharCardPNG(ctxFallback, null, null, palpite, selecoes, layout);
        try {
          const urlFallback = canvasFallback.toDataURL('image/png');
          iniciarDownload(urlFallback, palpite, layout);
        } catch (errFallback) {
          console.error("Erro fatal ao gerar card de imagem:", errFallback);
          alert("Infelizmente ocorreu um erro ao gerar a imagem no seu navegador. Você pode baixar o arquivo de texto para compartilhar.");
        }
      }
    });
  };

  // Calcular etapa atual da barra de progresso do topo
  let currentStep = 1;
  if (palpiteSalvoSucesso) {
    currentStep = 5;
  } else if (sugestao) {
    currentStep = 4;
  } else if (tipoPalpite) {
    currentStep = 3;
  } else if (partidaId) {
    currentStep = 2;
  }

  return (
    <main className="container pb-5">
      {/* Hero / Introdução */}
      <section className="hero mb-4">
        <div className="row align-items-center g-0">
          <div className="col-lg-8 hero-content p-4 p-md-5 position-relative">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <span className="hero-badge">🎮 Entretenimento</span>
              <Countdown />
            </div>
            <h1>Palpite da Partida</h1>
            <p>Analise o confronto respondendo perguntas e descubra a projeção calculada. Divertido, interativo e altamente compartilhável!</p>
          </div>
          <div className="col-lg-4 text-center p-4 p-md-5 position-relative">
            <img src="/assets/copa-2026-logo.svg" className="hero-logo" alt="Logo da Copa do Mundo FIFA 2026" />
          </div>
        </div>
      </section>

      {/* Publicidade Superior */}
      <AdBlock slot="predictions-top-banner" format="banner" />

      {/* Seletor de Confronto */}
      <MatchPicker 
        partidas={partidas}
        partidaId={partidaId}
        setPartidaId={setPartidaId}
        loading={loading}
        partidaAtual={partidaAtual}
      />

      {/* Indicador de Etapas da Jornada */}
      {partidaAtual && (
        <PredictionSteps currentStep={currentStep} />
      )}

      {/* Escolha do Tipo de Palpite */}
      {partidaAtual && tipoPalpite === '' && (
        partidaAtual.encerrada ? (
          <div className="animate-fade-in">
            <article className="card match-picker-card p-4 text-center mb-4">
              <div className="mb-3">
                <span className="badge px-3 py-2" style={{ fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px' }}>
                  Partida Encerrada 🔒
                </span>
              </div>
              <h3 className="titulo text-white mb-3">Confronto Concluído</h3>
              <p className="lead text-muted-old mx-auto mb-4" style={{ maxWidth: '600px' }}>
                Este confronto já ocorreu na vida real. Por razões de integridade e UX, palpites estão bloqueados para jogos finalizados.
              </p>
              <div className="d-flex justify-content-center align-items-center gap-4 my-3 p-3 mx-auto" style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '16px', maxWidth: '500px' }}>
                <div className="text-end" style={{ width: '40%' }}>
                  <span className="font-weight-bold text-white" style={{ fontSize: '1.1rem' }}>{partidaAtual.selecaoA}</span>
                </div>
                <div className="text-center px-3 py-2" style={{ background: 'var(--primary-soft)', border: '1px solid var(--primary)', borderRadius: '12px', minWidth: '80px' }}>
                  <span className="font-weight-bold text-white" style={{ fontSize: '1.4rem' }}>{partidaAtual.golsRealA} - {partidaAtual.golsRealB}</span>
                </div>
                <div className="text-start" style={{ width: '40%' }}>
                  <span className="font-weight-bold text-white" style={{ fontSize: '1.1rem' }}>{partidaAtual.selecaoB}</span>
                </div>
              </div>
              <div className="notice text-start mx-auto mt-4" style={{ maxWidth: '600px' }}>
                <span className="font-weight-bold">💡 O que você pode fazer:</span>
                <p className="small mb-0 text-muted mt-1">
                  Acesse a aba <strong>Confrontos</strong> para palpitar em jogos futuros ou vá em <strong>Minha Copa</strong> para simular todo o mata-mata do torneio!
                </p>
              </div>
            </article>
            
            <PredictionFinalForm 
              partidaAtual={partidaAtual}
              palpiteFinal={palpiteFinal}
              setPalpiteFinal={setPalpiteFinal}
              placarA={placarA}
              setPlacarA={setPlacarA}
              placarB={placarB}
              setPlacarB={setPlacarB}
              salvarPalpite={(e) => e.preventDefault()}
            />
          </div>
        ) : (
          <PredictionModeSelector setTipoPalpite={setTipoPalpite} />
        )
      )}

      {/* Questionário (Quiz) */}
      {partidaAtual && tipoPalpite !== '' && !sugestao && (
        <PredictionQuiz 
          tipoPalpite={tipoPalpite}
          partidaAtual={partidaAtual}
          respostas={respostas}
          handleRespostaChange={handleRespostaChange}
          handleTrocarTipo={handleTrocarTipo}
          calcularSugestao={handleCalcularSugestao}
          perguntasAtuais={perguntasAtuais}
        />
      )}

      {/* Publicidade Intermediária */}
      {partidaAtual && (
        <AdBlock slot="predictions-middle-rectangle" format="rectangle" />
      )}

      {/* Sugestão de Palpite e Formulário Final */}
      {partidaAtual && sugestao && (
        <section id="secao-resultado-sugerido" className="mb-4 animate-fade-in">
          <PredictionResult 
            partidaAtual={partidaAtual}
            sugestao={sugestao}
            tipoPalpite={tipoPalpite}
            palpiteFinal={palpiteFinal}
            respostas={respostas}
          />
          
          <PredictionFinalForm 
            partidaAtual={partidaAtual}
            palpiteFinal={palpiteFinal}
            setPalpiteFinal={setPalpiteFinal}
            placarA={placarA}
            setPlacarA={setPlacarA}
            placarB={placarB}
            setPlacarB={setPlacarB}
            salvarPalpite={handleSalvarPalpite}
          />
        </section>
      )}

      {/* Publicidade Inferior */}
      <AdBlock slot="predictions-bottom-banner" format="banner" />

      {/* Estatísticas Pessoais */}
      <PredictionStats palpites={palpitesSalvos} />

      {/* Conquistas (Gamificação) */}
      <PredictionAchievements palpites={palpitesSalvos} />

      {/* Histórico de Palpites */}
      <PredictionHistory 
        palpitesSalvos={palpitesSalvos}
        partidas={partidas}
        onDownloadCard={gerarImagemCardPalpite}
        onShareWhatsApp={compartilharNoWhatsApp}
        onDownloadTXT={baixarPalpitesComoTexto}
        onClearHistory={handleLimparPalpites}
        onExportData={exportarPalpitesJSON}
      />
    </main>
  );
}
