import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Countdown from '../components/Countdown';

const STORAGE_KEY = "copa2026_palpites";

export default function Predictions() {
  const [partidas, setPartidas] = useState([]);
  const [selecoes, setSelecoes] = useState([]);
  const [partidaId, setPartidaId] = useState('');
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // Modo de Palpite: '' | 'rapido' | 'detalhado'
  const [tipoPalpite, setTipoPalpite] = useState('');

  // Respostas estruturadas
  const [respostas, setRespostas] = useState({});

  // Estados da Sugestão e Palpite Final
  const [sugestao, setSugestao] = useState(null);
  const [palpiteFinal, setPalpiteFinal] = useState('');
  const [placarA, setPlacarA] = useState('');
  const [placarB, setPlacarB] = useState('');

  // Histórico
  const [palpitesSalvos, setPalpitesSalvos] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/data/partidas.json').then((r) => r.json()),
      fetch('/data/selecoes.json').then((r) => r.json()),
    ])
      .then(([partidasData, selecoesData]) => {
        setPartidas(partidasData || []);
        setSelecoes(selecoesData.copa_2026 || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar dados:', err);
        setLoading(false);
      });

    carregarHistorico();
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

  // Resetar estados ao mudar de partida
  useEffect(() => {
    setTipoPalpite('');
    setRespostas({});
    setSugestao(null);
    setPalpiteFinal('');
    setPlacarA('');
    setPlacarB('');
  }, [partidaId]);

  const carregarHistorico = () => {
    const dados = localStorage.getItem(STORAGE_KEY);
    setPalpitesSalvos(dados ? JSON.parse(dados) : []);
  };

  const partidaAtual = partidas.find((p) => p.id === partidaId);

  // Configuração das Perguntas
  const getPerguntasRapidas = (partida) => [
    {
      id: 'momento',
      titulo: 'Qual seleção chega em melhor momento?',
      opcoes: [
        { texto: partida.selecaoA, valor: partida.selecaoA, pontos: 'A' },
        { texto: 'Equilibrado', valor: 'Empate', pontos: 'Empate' },
        { texto: partida.selecaoB, valor: partida.selecaoB, pontos: 'B' },
      ],
    },
    {
      id: 'ataque',
      titulo: 'Qual equipe parece ter o ataque mais perigoso?',
      opcoes: [
        { texto: partida.selecaoA, valor: partida.selecaoA, pontos: 'A' },
        { texto: 'Ataques equilibrados', valor: 'Empate', pontos: 'Empate' },
        { texto: partida.selecaoB, valor: partida.selecaoB, pontos: 'B' },
      ],
    },
    {
      id: 'defesa',
      titulo: 'Qual equipe parece mais segura defensivamente?',
      opcoes: [
        { texto: partida.selecaoA, valor: partida.selecaoA, pontos: 'A' },
        { texto: 'Defesas equilibradas', valor: 'Empate', pontos: 'Empate' },
        { texto: partida.selecaoB, valor: partida.selecaoB, pontos: 'B' },
      ],
    },
    {
      id: 'experiencia',
      titulo: 'Qual seleção tem mais tradição ou experiência em Copas?',
      opcoes: [
        { texto: partida.selecaoA, valor: partida.selecaoA, pontos: 'A' },
        { texto: 'As duas têm peso parecido', valor: 'Empate', pontos: 'Empate' },
        { texto: partida.selecaoB, valor: partida.selecaoB, pontos: 'B' },
      ],
    },
    {
      id: 'cenario',
      titulo: 'Qual cenário você acha mais provável para o jogo?',
      opcoes: [
        { texto: `${partida.selecaoA} deve controlar mais a partida`, valor: partida.selecaoA, pontos: 'A' },
        { texto: 'O jogo deve ser equilibrado', valor: 'Empate', pontos: 'Empate' },
        { texto: `${partida.selecaoB} deve controlar mais a partida`, valor: partida.selecaoB, pontos: 'B' },
      ],
    },
  ];

  const getPerguntasDetalhadas = (partida) => [
    {
      id: 'fase',
      titulo: 'Qual equipe chega em melhor fase nos últimos jogos?',
      ajuda: 'Pense em quem venceu mais, perdeu menos ou vem jogando melhor recentemente.',
      opcoes: [
        { texto: partida.selecaoA, valor: partida.selecaoA, pontos: 'A' },
        { texto: 'Empate ou indefinido', valor: 'Empate', pontos: 'Empate' },
        { texto: partida.selecaoB, valor: partida.selecaoB, pontos: 'B' },
      ],
    },
    {
      id: 'elenco',
      titulo: 'Qual equipe parece ter o elenco mais forte ou equilibrado?',
      ajuda: 'Considere titulares, banco de reservas e qualidade geral dos jogadores.',
      opcoes: [
        { texto: partida.selecaoA, valor: partida.selecaoA, pontos: 'A' },
        { texto: 'Empate ou indefinido', valor: 'Empate', pontos: 'Empate' },
        { texto: partida.selecaoB, valor: partida.selecaoB, pontos: 'B' },
      ],
    },
    {
      id: 'desfalques',
      titulo: 'Alguma das equipes parece sofrer menos com desfalques importantes?',
      ajuda: 'Lesões, suspensões ou ausências de titulares podem mudar bastante o jogo.',
      opcoes: [
        { texto: partida.selecaoA, valor: partida.selecaoA, pontos: 'A' },
        { texto: 'Empate ou indefinido', valor: 'Empate', pontos: 'Empate' },
        { texto: partida.selecaoB, valor: partida.selecaoB, pontos: 'B' },
      ],
    },
    {
      id: 'ataque_detalhado',
      titulo: 'Qual equipe tem o ataque mais confiável no momento?',
      ajuda: 'Pense em quem cria mais chances, marca gols com frequência ou tem atacantes em boa fase.',
      opcoes: [
        { texto: partida.selecaoA, valor: partida.selecaoA, pontos: 'A' },
        { texto: 'Empate ou indefinido', valor: 'Empate', pontos: 'Empate' },
        { texto: partida.selecaoB, valor: partida.selecaoB, pontos: 'B' },
      ],
    },
    {
      id: 'defesa_detalhada',
      titulo: 'Qual equipe passa mais segurança defensiva?',
      ajuda: 'Considere quem sofre menos gols, comete menos erros e parece mais organizada atrás.',
      opcoes: [
        { texto: partida.selecaoA, valor: partida.selecaoA, pontos: 'A' },
        { texto: 'Empate ou indefinido', valor: 'Empate', pontos: 'Empate' },
        { texto: partida.selecaoB, valor: partida.selecaoB, pontos: 'B' },
      ],
    },
    {
      id: 'fisico',
      titulo: 'Qual equipe parece chegar melhor fisicamente ou menos prejudicada pelo contexto?',
      ajuda: 'Leve em conta viagem, descanso, clima, altitude ou pressão da torcida.',
      opcoes: [
        { texto: partida.selecaoA, valor: partida.selecaoA, pontos: 'A' },
        { texto: 'Empate ou indefinido', valor: 'Empate', pontos: 'Empate' },
        { texto: partida.selecaoB, valor: partida.selecaoB, pontos: 'B' },
      ],
    },
    {
      id: 'tatico',
      titulo: 'Qual equipe parece mais organizada taticamente?',
      ajuda: 'Pense em quem tem um plano de jogo mais claro e consegue se adaptar melhor.',
      opcoes: [
        { texto: partida.selecaoA, valor: partida.selecaoA, pontos: 'A' },
        { texto: 'Empate ou indefinido', valor: 'Empate', pontos: 'Empate' },
        { texto: partida.selecaoB, valor: partida.selecaoB, pontos: 'B' },
      ],
    },
    {
      id: 'ambiente',
      titulo: 'Qual equipe parece viver ambiente interno mais estável?',
      ajuda: 'Ausência de crise, troca de técnico, pressão exagerada ou conflitos pode ajudar.',
      opcoes: [
        { texto: partida.selecaoA, valor: partida.selecaoA, pontos: 'A' },
        { texto: 'Empate ou indefinido', valor: 'Empate', pontos: 'Empate' },
        { texto: partida.selecaoB, valor: partida.selecaoB, pontos: 'B' },
      ],
    },
    {
      id: 'psicologico',
      titulo: 'Qual equipe parece menos abalada por derrotas ou eliminações recentes?',
      ajuda: 'Uma goleada, eliminação ou derrota traumática pode afetar a confiança.',
      opcoes: [
        { texto: partida.selecaoA, valor: partida.selecaoA, pontos: 'A' },
        { texto: 'Empate ou indefinido', valor: 'Empate', pontos: 'Empate' },
        { texto: partida.selecaoB, valor: partida.selecaoB, pontos: 'B' },
      ],
    },
    {
      id: 'decisivo',
      titulo: 'Qual equipe tem o jogador mais capaz de decidir a partida sozinho?',
      ajuda: 'Considere craques em boa fase, goleadores, jogadores de bola parada, goleiros decisivos ou líderes técnicos.',
      opcoes: [
        { texto: partida.selecaoA, valor: partida.selecaoA, pontos: 'A' },
        { texto: 'Empate ou indefinido', valor: 'Empate', pontos: 'Empate' },
        { texto: partida.selecaoB, valor: partida.selecaoB, pontos: 'B' },
      ],
    },
  ];

  const perguntasAtuais =
    tipoPalpite === 'rapido'
      ? getPerguntasRapidas(partidaAtual || {})
      : tipoPalpite === 'detalhado'
      ? getPerguntasDetalhadas(partidaAtual || {})
      : [];

  const quizCompletado =
    perguntasAtuais.length > 0 &&
    perguntasAtuais.every((p) => respostas[p.id] !== undefined && respostas[p.id] !== '');

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
  };

  const calcularSugestao = () => {
    if (!partidaAtual || perguntasAtuais.length === 0) return;

    let pontosA = 0;
    let pontosB = 0;
    let pontosEmpate = 0;

    perguntasAtuais.forEach((p) => {
      const respValor = respostas[p.id];
      const opcao = p.opcoes.find((opt) => opt.valor === respValor);
      if (opcao) {
        if (opcao.pontos === 'A') pontosA++;
        else if (opcao.pontos === 'B') pontosB++;
        else pontosEmpate++;
      }
    });

    let resultadoSugerido = '';
    let descricao = '';

    if (pontosA > pontosB && pontosA > pontosEmpate) {
      resultadoSugerido = partidaAtual.selecaoA;
      descricao = `Pelas suas respostas, o <strong>${partidaAtual.selecaoA}</strong> parece chegar com mais força para esse confronto.`;
    } else if (pontosB > pontosA && pontosB > pontosEmpate) {
      resultadoSugerido = partidaAtual.selecaoB;
      descricao = `Pelas suas respostas, a <strong>${partidaAtual.selecaoB}</strong> parece chegar com mais força para esse confronto.`;
    } else {
      resultadoSugerido = 'Empate';
      descricao = `Pelas suas respostas, esse jogo tem cara de empate.`;
    }

    // Calcular o Nível de Confiança
    const scores = [pontosA, pontosB, pontosEmpate].sort((a, b) => b - a);
    const diff = scores[0] - scores[1];
    let nivelConfianca = '';

    if (diff === 0) {
      nivelConfianca = 'Confronto equilibrado';
    } else {
      if (tipoPalpite === 'rapido') {
        nivelConfianca = diff >= 3 ? 'Tendência forte' : 'Tendência leve';
      } else {
        if (diff >= 4) nivelConfianca = 'Favoritismo claro';
        else if (diff === 2 || diff === 3) nivelConfianca = 'Favoritismo moderado';
        else nivelConfianca = 'Leve vantagem';
      }
    }

    setSugestao({
      resultadoSugerido,
      descricao,
      pontosA,
      pontosB,
      pontosEmpate,
      nivelConfianca,
      totalPerguntas: perguntasAtuais.length,
    });

    setPalpiteFinal(resultadoSugerido);

    setTimeout(() => {
      document.getElementById('secao-resultado-sugerido')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const salvarPalpite = (e) => {
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
      totalPerguntas: sugestao.totalPerguntas,
      resultadoSugerido: sugestao.resultadoSugerido,
      palpiteFinal: palpiteFinal,
      placar: {
        selecaoA: parseInt(placarA),
        selecaoB: parseInt(placarB),
      },
      createdAt: new Date().toISOString(),
    };

    const palpites = localStorage.getItem(STORAGE_KEY) ? JSON.parse(localStorage.getItem(STORAGE_KEY)) : [];
    const index = palpites.findIndex((item) => item.matchId === palpite.matchId);

    if (index >= 0) {
      palpites[index] = palpite;
    } else {
      palpites.push(palpite);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(palpites));
    carregarHistorico();

    alert(`Palpite para ${partidaAtual.selecaoA} x ${partidaAtual.selecaoB} salvo com sucesso!`);

    setTimeout(() => {
      document.getElementById('secao-historico')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const limparPalpites = () => {
    if (window.confirm('Tem certeza de que deseja limpar todos os seus palpites salvos?')) {
      localStorage.removeItem(STORAGE_KEY);
      carregarHistorico();
      alert('Histórico de palpites limpo com sucesso!');
    }
  };

  // WhatsApp e TXT Sharing
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
    const texto = gerarTextoPalpites();
    if (!texto) return;
    const urlShare = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(urlShare, '_blank');
  };

  // Canvas Image Card Generation
  const codigoParaEmojiBandeira = (codigo) => {
    if (!codigo) return "⚽";
    if (codigo === "GB-ENG") return "🏴\u{e0067}\u{e0062}\u{e0065}\u{e006e}\u{e0067}\u{e007f}";
    if (codigo === "GB-SCT") return "🏴\u{e0067}\u{e0062}\u{e0073}\u{e0063}\u{e0074}\u{e007f}";

    const codePoints = codigo
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    try {
      return String.fromCodePoint(...codePoints);
    } catch (e) {
      return "⚽";
    }
  };

  const gerarImagemCardPalpite = (matchId) => {
    const palpite = palpitesSalvos.find((p) => p.matchId === matchId);
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
      canvas.width = 800;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');

      desenharElementos(ctx, imgA, imgB, palpite);

      try {
        const url = canvas.toDataURL('image/png');
        iniciarDownload(url, palpite);
      } catch (err) {
        console.warn("Falha de CORS/Taint com arquivos SVG. Utilizando fallback de emojis para o card...", err);
        const canvasFallback = document.createElement('canvas');
        canvasFallback.width = 800;
        canvasFallback.height = 800;
        const ctxFallback = canvasFallback.getContext('2d');
        desenharElementos(ctxFallback, null, null, palpite);
        try {
          const urlFallback = canvasFallback.toDataURL('image/png');
          iniciarDownload(urlFallback, palpite);
        } catch (errFallback) {
          console.error("Erro fatal ao gerar card de imagem:", errFallback);
          alert("Infelizmente ocorreu um erro ao gerar a imagem no seu navegador. Você pode baixar o arquivo de texto para compartilhar.");
        }
      }
    });
  };

  const desenharElementos = (ctx, imgA, imgB, palpite) => {
    // Fundo Gradiente
    const grad = ctx.createLinearGradient(0, 0, 0, 800);
    grad.addColorStop(0, '#0a4224');
    grad.addColorStop(0.6, '#062d18');
    grad.addColorStop(1, '#03160b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 800);

    // Linhas do Campo
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 3;
    ctx.strokeRect(150, 0, 500, 180);
    ctx.strokeRect(300, 0, 200, 60);
    ctx.beginPath();
    ctx.moveTo(40, 400);
    ctx.lineTo(760, 400);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(400, 400, 120, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(400, 400, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fill();
    ctx.strokeRect(150, 620, 500, 180);
    ctx.strokeRect(300, 740, 200, 60);

    // Moldura Dourada
    ctx.strokeStyle = 'rgba(255, 212, 57, 0.6)';
    ctx.lineWidth = 8;
    ctx.strokeRect(15, 15, 770, 770);

    // Cabeçalho
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.strokeStyle = '#ffd439';
    ctx.lineWidth = 2.5;
    desenharRetanguloArredondado(ctx, 240, 40, 320, 46, 10, true, true);

    ctx.fillStyle = '#ffd439';
    ctx.font = '900 18px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏆  FIFA WORLD CUP 2026  🏆', 400, 69);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 36px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillText('MEU PALPITE OFICIAL 📝', 400, 125);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    desenharRetanguloArredondado(ctx, 280, 150, 240, 32, 6, true, false);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '700 15px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillText(`GRUPO ${palpite.grupo.toUpperCase()} — RODADA ${palpite.rodada}`, 400, 171);

    // Confrontos
    const selA = selecoes.find((s) => s.nome.toLowerCase() === palpite.selecaoA.toLowerCase());
    const selB = selecoes.find((s) => s.nome.toLowerCase() === palpite.selecaoB.toLowerCase());

    // Card A
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2;
    desenharRetanguloArredondado(ctx, 130, 210, 150, 150, 16, true, true);
    if (imgA) {
      desenharImagemArredondada(ctx, imgA, 145, 225, 120, 120, 12);
    } else {
      const emojiA = codigoParaEmojiBandeira(selA?.codigo);
      ctx.font = '100px "Segoe UI Emoji", "Apple Color Emoji", "Segoe UI Symbol", sans-serif';
      ctx.fillText(emojiA, 205, 315);
    }
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 24px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;
    ctx.fillText(palpite.selecaoA, 205, 395);
    ctx.shadowColor = 'transparent';

    // Card B
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2;
    desenharRetanguloArredondado(ctx, 520, 210, 150, 150, 16, true, true);
    if (imgB) {
      desenharImagemArredondada(ctx, imgB, 535, 225, 120, 120, 12);
    } else {
      const emojiB = codigoParaEmojiBandeira(selB?.codigo);
      ctx.font = '100px "Segoe UI Emoji", "Apple Color Emoji", "Segoe UI Symbol", sans-serif';
      ctx.fillText(emojiB, 595, 315);
    }
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 24px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;
    ctx.fillText(palpite.selecaoB, 595, 395);
    ctx.shadowColor = 'transparent';

    // Placar
    ctx.fillStyle = '#0b0f19';
    ctx.strokeStyle = '#19c463';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(25, 196, 99, 0.3)';
    ctx.shadowBlur = 8;
    desenharRetanguloArredondado(ctx, 310, 255, 64, 86, 10, true, true);
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 56px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillText(palpite.placar.selecaoA.toString(), 342, 319);

    ctx.font = '48px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
    ctx.fillText('⚽', 400, 318);
    ctx.fillStyle = '#ffd439';
    ctx.font = 'bold italic 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('X', 400, 311);

    ctx.fillStyle = '#0b0f19';
    ctx.strokeStyle = '#19c463';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(25, 196, 99, 0.3)';
    ctx.shadowBlur = 8;
    desenharRetanguloArredondado(ctx, 426, 255, 64, 86, 10, true, true);
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 56px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillText(palpite.placar.selecaoB.toString(), 458, 319);

    // Resumo
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.strokeStyle = 'rgba(25, 196, 99, 0.3)';
    ctx.lineWidth = 2;
    desenharRetanguloArredondado(ctx, 200, 440, 400, 110, 14, true, true);

    ctx.fillStyle = '#19c463';
    ctx.beginPath();
    ctx.arc(245, 475, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('✓', 245, 480);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 21px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Resumo do Palpite', 270, 482);

    ctx.fillStyle = '#e2e8f0';
    ctx.textAlign = 'center';
    desenharRetanguloArredondado(ctx, 475, 463, 100, 26, 6, true, false);
    ctx.fillStyle = '#1e293b';
    ctx.font = '800 10px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillText('SUGESTÃO', 525, 480);

    ctx.fillStyle = '#19c463';
    ctx.font = '800 23px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    const pickText = palpite.palpiteFinal === 'Empate' ? 'Empate' : `Vitória da ${palpite.palpiteFinal}`;
    ctx.fillText(`Palpite Final: ${pickText}`, 400, 528);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.font = '700 16px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    const sugText = palpite.resultadoSugerido === 'Empate' ? 'Empate' : `Vitória da ${palpite.resultadoSugerido}`;
    ctx.fillText(`Sugestão do Quiz: ${sugText}`, 400, 582);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 22px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillText('Compartilhe seu Palpite!', 400, 622);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
    desenharRetanguloArredondado(ctx, 180, 640, 200, 40, 10, true, true);
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 13px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillText('COMPARTILHAR 📸 🐦 💬', 280, 665);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '700 11px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('DESAFIE SEUS AMIGOS!', 400, 656);
    ctx.fillStyle = '#ffd439';
    ctx.font = '800 13px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillText('@copa2026', 400, 674);

    ctx.textAlign = 'center';
    ctx.font = '38px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
    ctx.fillText('⚽🏆', 75, 742);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '700 15px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillText('Monte seus palpites e divirta-se com a gente!', 400, 734);
    ctx.fillStyle = '#ffd439';
    ctx.font = '800 16px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillText('@copa2026', 400, 755);

    ctx.font = '38px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
    ctx.fillText('🏆✨', 725, 742);
  };

  const desenharImagemArredondada = (ctx, img, x, y, width, height, radius) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, x, y, width, height);
    ctx.restore();
  };

  const desenharRetanguloArredondado = (ctx, x, y, width, height, radius, fill, stroke) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
    ctx.restore();
  };

  const iniciarDownload = (url, palpite) => {
    const slugName = (n) => n.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `palpite-${slugName(palpite.selecaoA)}-vs-${slugName(palpite.selecaoB)}.png`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderQuestionario = () => {
    if (perguntasAtuais.length === 0) return null;

    return (
      <section id="secao-questionario" className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 text-white mb-0">
            Responda às {perguntasAtuais.length} perguntas de análise ({tipoPalpite === 'rapido' ? 'Modo Rápido' : 'Modo Detalhado'})
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

        <div id="quiz-questions-container" className="quiz-section">
          {perguntasAtuais.map((p, idx) => (
            <div className="quiz-card mb-4" key={p.id}>
              <h3 className="quiz-question-title">
                <span className="quiz-question-number">{idx + 1}</span>
                {p.titulo}
              </h3>
              {p.ajuda && <p className="text-white-50 small mt-n2 mb-3 ms-4">{p.ajuda}</p>}
              <div className="quiz-options-group">
                {p.opcoes.map((opt, oIdx) => (
                  <div key={`${p.id}-${oIdx}`}>
                    <input
                      type="radio"
                      name={`q_${p.id}`}
                      id={`q_${p.id}_${oIdx}`}
                      className="quiz-option-input"
                      value={opt.valor}
                      checked={respostas[p.id] === opt.valor}
                      onChange={() => handleRespostaChange(p.id, opt.valor)}
                      required
                    />
                    <label htmlFor={`q_${p.id}_${oIdx}`} className="quiz-option-label">
                      {opt.texto}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <button
            type="button"
            id="btn-ver-sugestao"
            className="btn btn-primary btn-lg px-5 py-3"
            disabled={!quizCompletado}
            onClick={calcularSugestao}
          >
            Ver sugestão de palpite
          </button>
        </div>
      </section>
    );
  };

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
            <p>Responda algumas perguntas rápidas sobre o confronto e veja qual resultado combina mais com a sua análise. É só diversão, não previsão científica.</p>
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

      {/* Seletor de Confronto */}
      <section className="match-picker-card p-3 p-md-4 mb-4" id="match-picker-container">
        <h2 className="h5 text-white mb-3 text-center">Escolha um confronto da Fase de Grupos</h2>
        <div className="row">
          <div className="col-12 col-md-8 col-lg-6 mx-auto text-center">
            <select
              id="seletor-partida"
              className="form-select w-100 mb-3"
              aria-label="Escolher confronto"
              value={partidaId}
              onChange={(e) => setPartidaId(e.target.value)}
            >
              <option value="" disabled>Escolha uma partida...</option>
              {loading ? (
                <option disabled>Carregando partidas...</option>
              ) : (
                partidas.map((partida) => (
                  <option key={partida.id} value={partida.id}>
                    Grupo {partida.grupo} — Rodada {partida.rodada} — {partida.selecaoA} x {partida.selecaoB}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Card Detalhado do Confronto */}
        {partidaAtual && (
          <div id="secao-confronto-detalhe" className="mt-3">
            <div className="row justify-content-center">
              <div className="col-12 col-md-10 col-lg-8">
                <div className="match-card-vs" id="match-card-vs-element">
                  {/* Seleção A */}
                  <div className="match-card-team">
                    <div className="match-card-escudo-wrapper">
                      <img
                        src={`/${partidaAtual.escudoA}`}
                        alt={`Escudo de ${partidaAtual.selecaoA}`}
                        className="match-card-escudo"
                        onError={(e) => { e.currentTarget.src = '/assets/copa-2026-logo-white.svg'; }}
                      />
                    </div>
                    <h3 className="match-card-team-name">{partidaAtual.selecaoA}</h3>
                  </div>

                  {/* Meio */}
                  <div className="match-card-center-vs">
                    <span className="match-card-badge">Grupo {partidaAtual.grupo} — Rodada {partidaAtual.rodada}</span>
                    <span className="match-card-vs-text">VS</span>
                  </div>

                  {/* Seleção B */}
                  <div className="match-card-team">
                    <div className="match-card-escudo-wrapper">
                      <img
                        src={`/${partidaAtual.escudoB}`}
                        alt={`Escudo de ${partidaAtual.selecaoB}`}
                        className="match-card-escudo"
                        onError={(e) => { e.currentTarget.src = '/assets/copa-2026-logo-white.svg'; }}
                      />
                    </div>
                    <h3 className="match-card-team-name">{partidaAtual.selecaoB}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Escolha do Tipo de Palpite */}
      {partidaAtual && tipoPalpite === '' && (
        <section className="mb-4">
          <h2 className="h4 text-white mb-3 text-center">Escolha o tipo de palpite</h2>
          <div className="row g-4 justify-content-center">
            {/* Card 1: Palpite Rápido */}
            <div className="col-12 col-md-6 col-lg-5">
              <article className="quiz-card text-center d-flex flex-column justify-content-between h-100 p-4">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge rounded-pill text-bg-light px-3 py-2">⚡ 5 perguntas</span>
                    <span className="hero-badge" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>Rápido e prático</span>
                  </div>
                  <h3 className="h4 text-white font-weight-bold mb-3">Palpite Rápido</h3>
                  <p className="text-white-50">Responda poucas perguntas e registre seu palpite de forma prática e divertida.</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="btn btn-primary w-100 py-3"
                    onClick={() => setTipoPalpite('rapido')}
                    style={{ borderRadius: '14px', fontSize: '0.95rem' }}
                  >
                    Começar palpite rápido
                  </button>
                </div>
              </article>
            </div>

            {/* Card 2: Palpite Detalhado */}
            <div className="col-12 col-md-6 col-lg-5">
              <article className="quiz-card text-center d-flex flex-column justify-content-between h-100 p-4">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge rounded-pill text-bg-light px-3 py-2">📊 10 perguntas</span>
                    <span className="hero-badge" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderColor: 'var(--accent-2)', color: '#d8f3ff', background: 'rgba(0,183,255,0.1)' }}>Mais detalhado e preciso</span>
                  </div>
                  <h3 className="h4 text-white font-weight-bold mb-3">Palpite Detalhado</h3>
                  <p className="text-white-50">Use uma análise mais completa para chegar a um palpite mais bem fundamentado.</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="btn btn-primary w-100 py-3"
                    onClick={() => setTipoPalpite('detalhado')}
                    style={{
                      borderRadius: '14px',
                      fontSize: '0.95rem',
                      background: 'linear-gradient(135deg, #174cff, #00b7ff 48%, #19c463)'
                    }}
                  >
                    Começar palpite detalhado
                  </button>
                </div>
              </article>
            </div>
          </div>
        </section>
      )}

      {/* Questionário (Quiz) */}
      {partidaAtual && tipoPalpite !== '' && renderQuestionario()}

      {/* Publicidade Intermediária */}
      <section className="ad-slot mb-4" aria-label="Espaço para anúncio">
        <span className="ad-slot__label">Publicidade</span>
        <div className="ad-slot__placeholder">Espaço para Google AdSense — anúncio intermediário</div>
      </section>

      {/* Sugestão de Palpite e Formulário Final */}
      {partidaAtual && sugestao && (
        <section id="secao-resultado-sugerido" className="mb-4">
          <div className="suggestion-card">
            <div className="suggestion-header">
              <span className="hero-badge mb-2" style={{ borderColor: 'rgba(25, 196, 99, 0.4)', background: 'rgba(25, 196, 99, 0.15)', color: '#dcfce7' }}>
                🔍 {sugestao.nivelConfianca}
              </span>
              <h2 className="h5 text-white-50 uppercase mt-2 mb-1">Análise calculada ({tipoPalpite === 'rapido' ? 'Rápido' : 'Detalhado'})</h2>
              <div className="suggestion-trend">
                {sugestao.resultadoSugerido === 'Empate' ? 'Empate' : `Vitória do ${sugestao.resultadoSugerido}`}
              </div>
              <p className="mt-3 text-white-50 mb-0" dangerouslySetInnerHTML={{ __html: sugestao.descricao }}></p>
            </div>

            {/* Pontuação detalhada */}
            <div className="text-center mt-4">
              <span className="small text-white-50">Distribuição de pontos da sua análise:</span>
              <div className="suggestion-scores-grid">
                <div className={`suggestion-score-badge ${sugestao.pontosA > sugestao.pontosB && sugestao.pontosA > sugestao.pontosEmpate ? 'winner' : ''}`}>
                  <span>{partidaAtual.selecaoA}</span>: 
                  <span className="suggestion-score-num">{sugestao.pontosA}</span>
                </div>
                <div className={`suggestion-score-badge ${sugestao.pontosEmpate >= sugestao.pontosA && sugestao.pontosEmpate >= sugestao.pontosB ? 'winner' : ''}`}>
                  <span>Empate</span>: 
                  <span className="suggestion-score-num">{sugestao.pontosEmpate}</span>
                </div>
                <div className={`suggestion-score-badge ${sugestao.pontosB > sugestao.pontosA && sugestao.pontosB > sugestao.pontosEmpate ? 'winner' : ''}`}>
                  <span>{partidaAtual.selecaoB}</span>: 
                  <span className="suggestion-score-num">{sugestao.pontosB}</span>
                </div>
              </div>
            </div>

            {/* Palpite Final do Usuário */}
            <div className="user-prediction-form mt-5">
              <h3 className="h5 text-white text-center mb-3">Registrar seu palpite final</h3>
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
                    <label htmlFor="radio-final-a" className="prediction-radio-label">Vitória do {partidaAtual.selecaoA}</label>
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
                    <label htmlFor="radio-final-empate" className="prediction-radio-label">Empate</label>
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
                    <label htmlFor="radio-final-b" className="prediction-radio-label">Vitória da {partidaAtual.selecaoB}</label>
                  </div>
                </div>

                <p className="text-center text-white-50 small mb-2 mt-4">Qual será o placar da partida?</p>
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
                  <button type="submit" className="btn btn-primary px-5 py-2" style={{ borderRadius: '12px' }}>
                    Salvar meu palpite
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Publicidade Inferior */}
      <section className="ad-slot mb-4" aria-label="Espaço para anúncio">
        <span className="ad-slot__label">Publicidade</span>
        <div className="ad-slot__placeholder">Espaço para Google AdSense — anúncio inferior antes do histórico</div>
      </section>

      {/* Histórico de Palpites */}
      <section className="history-section-card" id="secao-historico">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h2 className="h5 text-white mb-0">🏆 Meus palpites salvos</h2>
          {palpitesSalvos.length > 0 && (
            <div className="d-flex gap-2 align-items-center">
              <button
                type="button"
                className="btn-whatsapp-share"
                onClick={compartilharNoWhatsApp}
              >
                🟢 Compartilhar no WhatsApp
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-light px-3 py-1"
                style={{ borderRadius: '10px' }}
                onClick={baixarPalpitesComoTexto}
              >
                📥 Baixar TXT
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger px-3 py-1"
                style={{ borderRadius: '10px' }}
                onClick={limparPalpites}
              >
                Limpar palpites
              </button>
            </div>
          )}
        </div>

        <div className="row g-3" id="historico-palpites-lista">
          {palpitesSalvos.length === 0 ? (
            <div className="col-12">
              <div className="history-empty">
                <p className="mb-0">Você ainda não salvou nenhum palpite. Escolha um confronto acima para começar!</p>
              </div>
            </div>
          ) : (
            palpitesSalvos
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((palpite) => {
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
                const confDisplay = palpite.nivelConfianca || (palpite.tipoPalpite === 'detalhado' ? 'Favoritismo moderado' : 'Tendência forte');

                return (
                  <div className="col-12 col-md-6" key={palpite.matchId}>
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
                        <span className="history-detail-label">Nível de Confiança:</span>
                        <span className="history-detail-val suggested" style={{ color: 'var(--accent)' }}>
                          {confDisplay}
                        </span>

                        <span className="history-detail-label">Sugestão do quiz:</span>
                        <span className="history-detail-val suggested">
                          {palpite.resultadoSugerido === 'Empate' ? 'Empate' : `Vitória ${palpite.resultadoSugerido}`}
                        </span>

                        <span className="history-detail-label">Seu palpite final:</span>
                        <span className="history-detail-val final-pick">
                          {palpite.palpiteFinal === 'Empate' ? 'Empate' : `Vitória ${palpite.palpiteFinal}`}
                        </span>
                      </div>

                      {/* Pontuação detalhada */}
                      <div className="mt-2 pt-2 border-top border-light-subtle small text-white-50 text-center">
                        {palpite.selecaoA} {palpite.pontuacao?.selecaoA ?? 0} · Empate {palpite.pontuacao?.empate ?? 0} · {palpite.selecaoB} {palpite.pontuacao?.selecaoB ?? 0}
                      </div>

                      <div className="d-grid mt-3">
                        <button
                          type="button"
                          className="btn btn-sm btn-success btn-baixar-card-img px-3"
                          onClick={() => gerarImagemCardPalpite(palpite.matchId)}
                          style={{ borderRadius: '10px', fontSize: '0.8rem', minHeight: '34px' }}
                        >
                          🖼️ Baixar Card (Imagem PNG)
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </section>
    </main>
  );
}
