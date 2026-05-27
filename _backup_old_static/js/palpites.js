const STORAGE_KEY = "copa2026_palpites";
let partidas = [];
let partidaAtual = null;
let respostasAtuais = {
  momento: null,
  ataque: null,
  defesa: null,
  experiencia: null,
  cenario: null
};

document.addEventListener('DOMContentLoaded', () => {
  carregarPartidas();
  configurarEventos();
});

let selecoes = [];

function carregarPartidas() {
  Promise.all([
    fetch('data/partidas.json').then(r => r.json()),
    fetch('data/selecoes.json').then(r => r.json())
  ])
  .then(([partidasData, selecoesData]) => {
    partidas = partidasData;
    selecoes = selecoesData.copa_2026 || [];
    popularSeletorPartidas();
  })
  .catch(error => {
    console.error('Erro ao carregar arquivos JSON:', error);
    const container = document.getElementById('match-picker-container');
    if (container) {
      container.innerHTML = '<div class="empty-state">Não foi possível carregar a lista de confrontos.</div>';
    }
  });
}

function popularSeletorPartidas() {
  const select = document.getElementById('seletor-partida');
  if (!select) return;

  select.innerHTML = '<option value="" disabled selected>Escolha uma partida...</option>';
  partidas.forEach(partida => {
    const opt = document.createElement('option');
    opt.value = partida.id;
    opt.textContent = `Grupo ${partida.grupo} — Rodada ${partida.rodada} — ${partida.selecaoA} x ${partida.selecaoB}`;
    select.appendChild(opt);
  });

  // Mostrar histórico inicial
  atualizarHistoricoTela();
}

function configurarEventos() {
  const select = document.getElementById('seletor-partida');
  select?.addEventListener('change', (e) => {
    const partidaId = e.target.value;
    const partida = partidas.find(p => p.id === partidaId);
    if (partida) {
      selecionarPartida(partida);
    }
  });

  // Carregar partida pré-selecionada se houver
  const preSelectedId = sessionStorage.getItem('pre_selected_match_id');
  if (preSelectedId) {
    sessionStorage.removeItem('pre_selected_match_id');
    const partida = partidas.find(p => p.id === preSelectedId);
    if (partida) {
      setTimeout(() => {
        if (select) {
          select.value = preSelectedId;
          selecionarPartida(partida);
        }
      }, 100);
    }
  }

  const btnSugerir = document.getElementById('btn-ver-sugestao');
  btnSugerir?.addEventListener('click', calcularSugestao);

  const formPrediction = document.getElementById('form-palpite-final');
  formPrediction?.addEventListener('submit', (e) => {
    e.preventDefault();
    salvarPalpiteUsuario();
  });

  const btnLimpar = document.getElementById('btn-limpar-palpites');
  btnLimpar?.addEventListener('click', () => {
    if (confirm('Tem certeza de que deseja limpar todos os seus palpites salvos?')) {
      limparPalpites();
      atualizarHistoricoTela();
      alert('Histórico de palpites limpo com sucesso!');
    }
  });

  const btnBaixar = document.getElementById('btn-baixar-palpites');
  btnBaixar?.addEventListener('click', baixarPalpitesComoTexto);

  const btnWhatsApp = document.getElementById('btn-whatsapp-palpites');
  btnWhatsApp?.addEventListener('click', compartilharNoWhatsApp);
}

function selecionarPartida(partida) {
  partidaAtual = partida;
  respostasAtuais = {
    momento: null,
    ataque: null,
    defesa: null,
    experiencia: null,
    cenario: null
  };

  // Atualizar Card de Confronto
  document.getElementById('card-grupo-rodada').textContent = `Grupo ${partida.grupo} — Rodada ${partida.rodada}`;
  document.getElementById('card-selecao-a-nome').textContent = partida.selecaoA;
  document.getElementById('card-selecao-b-nome').textContent = partida.selecaoB;
  
  const imgEscudoA = document.getElementById('card-selecao-a-escudo');
  const imgEscudoB = document.getElementById('card-selecao-b-escudo');
  if (imgEscudoA) imgEscudoA.src = partida.escudoA;
  if (imgEscudoB) imgEscudoB.src = partida.escudoB;

  // Atualizar fundo do card se houver bandeiras
  const cardVs = document.getElementById('match-card-vs-element');
  if (cardVs) {
    // Usar bandeiraA como marca d'água no lado esquerdo/direito se necessário, ou manter o visual atual limpo
  }

  // Exibir a seção de perguntas e esconder sugestões anteriores
  document.getElementById('secao-confronto-detalhe').classList.remove('d-none');
  document.getElementById('secao-questionario').classList.remove('d-none');
  document.getElementById('secao-resultado-sugerido').classList.add('d-none');

  // Renderizar as perguntas com os nomes das seleções
  renderizarQuestionario(partida);
}

function renderizarQuestionario(partida) {
  const container = document.getElementById('quiz-questions-container');
  if (!container) return;

  const perguntas = [
    {
      id: "momento",
      pergunta: "Qual seleção chega em melhor momento?",
      opcoes: [
        { texto: partida.selecaoA, valor: partida.selecaoA, pontos: "A" },
        { texto: "Equilibrado", valor: "Empate", pontos: "Empate" },
        { texto: partida.selecaoB, valor: partida.selecaoB, pontos: "B" }
      ]
    },
    {
      id: "ataque",
      pergunta: "Qual equipe parece ter o ataque mais perigoso?",
      opcoes: [
        { texto: partida.selecaoA, valor: partida.selecaoA, pontos: "A" },
        { texto: "Ataques equilibrados", valor: "Empate", pontos: "Empate" },
        { texto: partida.selecaoB, valor: partida.selecaoB, pontos: "B" }
      ]
    },
    {
      id: "defesa",
      pergunta: "Qual equipe parece mais segura defensivamente?",
      opcoes: [
        { texto: partida.selecaoA, valor: partida.selecaoA, pontos: "A" },
        { texto: "Defesas equilibradas", valor: "Empate", pontos: "Empate" },
        { texto: partida.selecaoB, valor: partida.selecaoB, pontos: "B" }
      ]
    },
    {
      id: "experiencia",
      pergunta: "Qual seleção tem mais tradição ou experiência em Copas?",
      opcoes: [
        { texto: partida.selecaoA, valor: partida.selecaoA, pontos: "A" },
        { texto: "As duas têm peso parecido", valor: "Empate", pontos: "Empate" },
        { texto: partida.selecaoB, valor: partida.selecaoB, pontos: "B" }
      ]
    },
    {
      id: "cenario",
      pergunta: "Qual cenário você acha mais provável para o jogo?",
      opcoes: [
        { texto: "Uma seleção deve controlar a partida", valor: partida.selecaoA, pontos: "A" },
        { texto: "O jogo deve ser equilibrado", valor: "Empate", pontos: "Empate" },
        { texto: "Pode ser uma partida imprevisível", valor: "Empate", pontos: "Empate" }
      ]
    }
  ];

  container.innerHTML = "";

  perguntas.forEach((p, idx) => {
    const questionCard = document.createElement('div');
    questionCard.className = "quiz-card mb-4";
    questionCard.innerHTML = `
      <h3 class="quiz-question-title">
        <span class="quiz-question-number">${idx + 1}</span>
        ${p.pergunta}
      </h3>
      <div class="quiz-options-group">
        ${p.opcoes.map((opt, oIdx) => `
          <div>
            <input type="radio" name="q_${p.id}" id="q_${p.id}_${oIdx}" class="quiz-option-input" value="${opt.valor}" data-pontos="${opt.pontos}" required>
            <label for="q_${p.id}_${oIdx}" class="quiz-option-label">
              ${opt.texto}
            </label>
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(questionCard);

    // Adicionar escutador para marcar as respostas selecionadas
    const radios = questionCard.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        respostasAtuais[p.id] = e.target.value;
        verificarFormularioCompleto();
      });
    });
  });

  // Desabilitar o botão de ver sugestão até responder tudo
  const btnSugerir = document.getElementById('btn-ver-sugestao');
  if (btnSugerir) btnSugerir.disabled = true;
}

function verificarFormularioCompleto() {
  const respondidas = Object.values(respostasAtuais).every(val => val !== null);
  const btnSugerir = document.getElementById('btn-ver-sugestao');
  if (btnSugerir) {
    btnSugerir.disabled = !respondidas;
  }
}

function calcularSugestao() {
  if (!partidaAtual) return;

  let pontosA = 0;
  let pontosB = 0;
  let pontosEmpate = 0;

  // Pegar os inputs selecionados e calcular
  const inputs = document.querySelectorAll('#quiz-questions-container input[type="radio"]:checked');
  inputs.forEach(input => {
    const tipoPontos = input.dataset.pontos;
    if (tipoPontos === "A") pontosA++;
    else if (tipoPontos === "B") pontosB++;
    else if (tipoPontos === "Empate") pontosEmpate++;
  });

  // Determinar sugestão de resultado
  let resultadoSugeridoText = "";
  let sugestaoDescritiva = "";

  if (pontosA > pontosB && pontosA > pontosEmpate) {
    resultadoSugeridoText = partidaAtual.selecaoA;
    sugestaoDescritiva = `Pelas suas respostas, o <strong>${partidaAtual.selecaoA}</strong> parece chegar com mais força para esse confronto.`;
  } else if (pontosB > pontosA && pontosB > pontosEmpate) {
    resultadoSugeridoText = partidaAtual.selecaoB;
    sugestaoDescritiva = `Pelas suas respostas, a <strong>${partidaAtual.selecaoB}</strong> parece chegar com mais força para esse confronto.`;
  } else {
    resultadoSugeridoText = "Empate";
    sugestaoDescritiva = `Pelas suas respostas, esse jogo tem cara de empate.`;
  }

  // Preencher dados na tela
  const elTrend = document.getElementById('sugestao-resultado-tende');
  const elDesc = document.getElementById('sugestao-descricao');
  if (elTrend) elTrend.textContent = resultadoSugeridoText === "Empate" ? "Empate" : `Vitória do ${resultadoSugeridoText}`;
  if (elDesc) elDesc.innerHTML = sugestaoDescritiva;

  // Detalhes dos pontos
  document.getElementById('ponto-selecao-a-nome').textContent = partidaAtual.selecaoA;
  document.getElementById('ponto-selecao-a-val').textContent = pontosA;
  document.getElementById('ponto-empate-val').textContent = pontosEmpate;
  document.getElementById('ponto-selecao-b-nome').textContent = partidaAtual.selecaoB;
  document.getElementById('ponto-selecao-b-val').textContent = pontosB;

  // Adicionar classe "winner" para o maior ponto
  const cardA = document.getElementById('badge-pontos-a');
  const cardEmp = document.getElementById('badge-pontos-empate');
  const cardB = document.getElementById('badge-pontos-b');
  
  cardA?.classList.remove('winner');
  cardEmp?.classList.remove('winner');
  cardB?.classList.remove('winner');

  const maxPontos = Math.max(pontosA, pontosB, pontosEmpate);
  if (pontosA === maxPontos && pontosA > pontosB && pontosA > pontosEmpate) cardA?.classList.add('winner');
  else if (pontosB === maxPontos && pontosB > pontosA && pontosB > pontosEmpate) cardB?.classList.add('winner');
  else cardEmp?.classList.add('winner'); // Empates técnicos também ganham destaque de empate

  // Configurar Formulário de Palpite Final do Usuário
  configurarFormularioFinal(pontosA, pontosB, pontosEmpate, resultadoSugeridoText);

  // Exibir a seção de resultados sugeridos
  document.getElementById('secao-resultado-sugerido').classList.remove('d-none');

  // Rolar suavemente até o bloco de sugestão
  document.getElementById('secao-resultado-sugerido').scrollIntoView({ behavior: 'smooth' });
}

function configurarFormularioFinal(pontosA, pontosB, pontosEmpate, resultadoSugeridoText) {
  // Configurar labels do Palpite Final do Usuário
  document.getElementById('label-radio-final-a').textContent = `Vitória do ${partidaAtual.selecaoA}`;
  document.getElementById('radio-final-a').value = partidaAtual.selecaoA;
  
  document.getElementById('radio-final-empate').value = "Empate";
  
  document.getElementById('label-radio-final-b').textContent = `Vitória da ${partidaAtual.selecaoB}`;
  document.getElementById('radio-final-b').value = partidaAtual.selecaoB;

  // Limpar inputs de placar e seleção anterior
  document.getElementById('placar-a').value = "";
  document.getElementById('placar-b').value = "";
  
  const radios = document.querySelectorAll('input[name="palpite_final_opcao"]');
  radios.forEach(r => r.checked = false);

  // Preencher nomes dos placares
  document.getElementById('label-placar-a').textContent = partidaAtual.selecaoA;
  document.getElementById('label-placar-b').textContent = partidaAtual.selecaoB;

  // Pré-selecionar o resultado sugerido para facilitar para o usuário
  if (resultadoSugeridoText === "Empate") {
    document.getElementById('radio-final-empate').checked = true;
  } else if (resultadoSugeridoText === partidaAtual.selecaoA) {
    document.getElementById('radio-final-a').checked = true;
  } else {
    document.getElementById('radio-final-b').checked = true;
  }

  // Guardar a pontuação temporária no formulário para salvar depois
  const form = document.getElementById('form-palpite-final');
  form.dataset.pontosA = pontosA;
  document.getElementById('form-palpite-final').dataset.pontosB = pontosB;
  document.getElementById('form-palpite-final').dataset.pontosEmpate = pontosEmpate;
  document.getElementById('form-palpite-final').dataset.sugerido = resultadoSugeridoText;
}

function salvarPalpiteUsuario() {
  if (!partidaAtual) return;

  const radioSelecionado = document.querySelector('input[name="palpite_final_opcao"]:checked');
  if (!radioSelecionado) {
    alert("Por favor, selecione o seu palpite final (Vitória A, Empate ou Vitória B).");
    return;
  }

  const placarAVal = document.getElementById('placar-a').value;
  const placarBVal = document.getElementById('placar-b').value;

  if (placarAVal === "" || placarBVal === "") {
    alert("Por favor, preencha o placar do jogo.");
    return;
  }

  const form = document.getElementById('form-palpite-final');
  const pontosA = parseInt(form.dataset.pontosA) || 0;
  const pontosB = parseInt(form.dataset.pontosB) || 0;
  const pontosEmpate = parseInt(form.dataset.pontosEmpate) || 0;
  const sugerido = form.dataset.sugerido;

  // Montar as respostas do questionário na estrutura solicitada
  const respostasSalvas = {};
  
  // Pegar os valores que foram marcados
  const momentoVal = document.querySelector('input[name="q_momento"]:checked')?.value;
  const ataqueVal = document.querySelector('input[name="q_ataque"]:checked')?.value;
  const defesaVal = document.querySelector('input[name="q_defesa"]:checked')?.value;
  const experienciaVal = document.querySelector('input[name="q_experiencia"]:checked')?.value;
  const cenarioVal = document.querySelector('input[name="q_cenario"]:checked')?.value;

  const palpite = {
    matchId: partidaAtual.id,
    grupo: partidaAtual.grupo,
    rodada: partidaAtual.rodada,
    selecaoA: partidaAtual.selecaoA,
    selecaoB: partidaAtual.selecaoB,
    respostas: {
      momento: momentoVal,
      ataque: ataqueVal,
      defesa: defesaVal,
      experiencia: experienciaVal,
      cenario: cenarioVal
    },
    pontuacao: {
      selecaoA: pontosA,
      empate: pontosEmpate,
      selecaoB: pontosB
    },
    resultadoSugerido: sugerido,
    palpiteFinal: radioSelecionado.value,
    placar: {
      selecaoA: parseInt(placarAVal),
      selecaoB: parseInt(placarBVal)
    },
    createdAt: new Date().toISOString()
  };

  salvarPalpite(palpite);
  atualizarHistoricoTela();

  // Resetar seleções e mostrar mensagem de sucesso
  alert(`Palpite para ${partidaAtual.selecaoA} x ${partidaAtual.selecaoB} salvo com sucesso!`);
  
  // Rolar até a área do histórico
  document.getElementById('secao-historico').scrollIntoView({ behavior: 'smooth' });
}

function carregarPalpites() {
  const dados = localStorage.getItem(STORAGE_KEY);
  return dados ? JSON.parse(dados) : [];
}

function salvarPalpite(palpite) {
  const palpites = carregarPalpites();
  const index = palpites.findIndex(item => item.matchId === palpite.matchId);

  if (index >= 0) {
    palpites[index] = palpite;
  } else {
    palpites.push(palpite);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(palpites));
}

function limparPalpites() {
  localStorage.removeItem(STORAGE_KEY);
}

function atualizarHistoricoTela() {
  const container = document.getElementById('historico-palpites-lista');
  if (!container) return;

  const palpites = carregarPalpites();

  if (palpites.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="history-empty">
          <p class="mb-0">Você ainda não salvou nenhum palpite. Escolha um confronto acima para começar!</p>
        </div>
      </div>
    `;
    const btnLimpar = document.getElementById('btn-limpar-palpites');
    const btnBaixar = document.getElementById('btn-baixar-palpites');
    const btnWhatsApp = document.getElementById('btn-whatsapp-palpites');
    if (btnLimpar) btnLimpar.style.display = 'none';
    if (btnBaixar) btnBaixar.style.display = 'none';
    if (btnWhatsApp) btnWhatsApp.style.display = 'none';
    return;
  }

  // Configurar escutador de eventos para cliques em "Baixar Card" delegados no histórico
  if (!container.dataset.hasListener) {
    container.dataset.hasListener = "true";
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-baixar-card-img');
      if (btn) {
        const matchId = btn.dataset.matchId;
        gerarImagemCardPalpite(matchId);
      }
    });
  }

  // Mostrar botões de ação
  const btnLimpar = document.getElementById('btn-limpar-palpites');
  const btnBaixar = document.getElementById('btn-baixar-palpites');
  const btnWhatsApp = document.getElementById('btn-whatsapp-palpites');
  if (btnLimpar) btnLimpar.style.display = 'inline-block';
  if (btnBaixar) btnBaixar.style.display = 'inline-block';
  if (btnWhatsApp) btnWhatsApp.style.display = 'inline-flex';

  container.innerHTML = "";

  // Ordenar palpites por data decrescente
  palpites.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Vamos precisar mapear os escudos das partidas salvas
  // Como podemos ter partidas com IDs que estão no JSON
  palpites.forEach(palpite => {
    // Achar a partida correspondente no JSON para carregar os escudos e bandeiras
    const partidaInfo = partidas.find(p => p.id === palpite.matchId);
    const escudoA = partidaInfo ? partidaInfo.escudoA : 'escudos/default.svg';
    const escudoB = partidaInfo ? partidaInfo.escudoB : 'escudos/default.svg';

    const dataFormatada = new Date(palpite.createdAt).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const itemCard = document.createElement('div');
    itemCard.className = "col-12 col-md-6";
    itemCard.innerHTML = `
      <div class="history-item-card">
        <div class="history-item-header">
          <span class="history-item-badge">Grupo ${palpite.grupo} — Rodada ${palpite.rodada}</span>
          <span class="history-item-date">${dataFormatada}</span>
        </div>
        <div class="history-matchup">
          <div class="history-matchup-team">
            <img src="${escudoA}" alt="Escudo de ${palpite.selecaoA}" onerror="this.src='assets/copa-2026-logo-white.svg'">
            <span>${palpite.selecaoA}</span>
          </div>
          <div class="history-score-display">${palpite.placar.selecaoA} x ${palpite.placar.selecaoB}</div>
          <div class="history-matchup-team text-end justify-content-end">
            <span>${palpite.selecaoB}</span>
            <img src="${escudoB}" alt="Escudo de ${palpite.selecaoB}" onerror="this.src='assets/copa-2026-logo-white.svg'">
          </div>
        </div>
        <div class="history-item-details">
          <span class="history-detail-label">Sugestão do quiz:</span>
          <span class="history-detail-val suggested">
            ${palpite.resultadoSugerido === "Empate" ? "Empate" : `Vitória ${palpite.resultadoSugerido}`}
          </span>
          <span class="history-detail-label">Seu palpite final:</span>
          <span class="history-detail-val final-pick">
            ${palpite.palpiteFinal === "Empate" ? "Empate" : `Vitória ${palpite.palpiteFinal}`}
          </span>
        </div>
        <div class="d-grid mt-3">
          <button type="button" class="btn btn-sm btn-success btn-baixar-card-img px-3" data-match-id="${palpite.matchId}" style="border-radius: 10px; font-size: 0.8rem; min-height: 34px;">
            🖼️ Baixar Card (Imagem PNG)
          </button>
        </div>
      </div>
    `;
    container.appendChild(itemCard);
  });
}

function codigoParaEmojiBandeira(codigo) {
  if (!codigo) return "⚽";
  if (codigo === "GB-ENG") return "🏴\u{e0067}\u{e0062}\u{e0065}\u{e006e}\u{e0067}\u{e007f}";
  if (codigo === "GB-SCT") return "🏴\u{e0067}\u{e0062}\u{e0073}\u{e0063}\u{e0074}\u{e007f}";
  
  const codePoints = codigo
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  try {
    return String.fromCodePoint(...codePoints);
  } catch (e) {
    return "⚽";
  }
}

function gerarImagemCardPalpite(matchId) {
  const palpites = carregarPalpites();
  const palpite = palpites.find(p => p.matchId === matchId);
  if (!palpite) return;

  const partidaInfo = partidas.find(p => p.id === matchId);
  const bandeiraAPath = partidaInfo ? partidaInfo.bandeiraA : '';
  const bandeiraBPath = partidaInfo ? partidaInfo.bandeiraB : '';

  // Carregar imagens das bandeiras quadradas
  Promise.all([
    carregarImagem(bandeiraAPath),
    carregarImagem(bandeiraBPath)
  ]).then(([imgA, imgB]) => {
    renderizarEDownload(imgA, imgB);
  });

  function carregarImagem(src) {
    return new Promise((resolve) => {
      if (!src) return resolve(null);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  function renderizarEDownload(imgA, imgB) {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    desenharElementos(ctx, imgA, imgB);

    try {
      const url = canvas.toDataURL('image/png');
      iniciarDownload(url);
    } catch (err) {
      console.warn("Falha de CORS/Taint com arquivos SVG. Utilizando fallback de emojis para o card...", err);
      // Se falhar (ex: rodando via protocolo file:// no Chrome), reconstrói o canvas apenas com emojis
      const canvasFallback = document.createElement('canvas');
      canvasFallback.width = 800;
      canvasFallback.height = 800;
      const ctxFallback = canvasFallback.getContext('2d');
      
      desenharElementos(ctxFallback, null, null);
      
      try {
        const urlFallback = canvasFallback.toDataURL('image/png');
        iniciarDownload(urlFallback);
      } catch (errFallback) {
        console.error("Erro fatal ao gerar card de imagem:", errFallback);
        alert("Infelizmente ocorreu um erro ao gerar a imagem no seu navegador. Você pode baixar o arquivo de texto para compartilhar.");
      }
    }
  }

  function desenharElementos(ctx, imgA, imgB) {
    // 1. Fundo Gradiente (Verde de Campo de Futebol escuro)
    const grad = ctx.createLinearGradient(0, 0, 0, 800);
    grad.addColorStop(0, '#0a4224');
    grad.addColorStop(0.6, '#062d18');
    grad.addColorStop(1, '#03160b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 800);

    // 2. Linhas do Campo de Futebol
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 3;
    
    // Grande área superior
    ctx.strokeRect(150, 0, 500, 180);
    // Pequena área superior
    ctx.strokeRect(300, 0, 200, 60);
    
    // Meio de campo
    ctx.beginPath();
    ctx.moveTo(40, 400);
    ctx.lineTo(760, 400);
    ctx.stroke();

    // Círculo central
    ctx.beginPath();
    ctx.arc(400, 400, 120, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(400, 400, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fill();

    // Grande área inferior
    ctx.strokeRect(150, 620, 500, 180);
    // Pequena área inferior
    ctx.strokeRect(300, 740, 200, 60);

    // Moldura Dourada Principal
    ctx.strokeStyle = 'rgba(255, 212, 57, 0.6)';
    ctx.lineWidth = 8;
    ctx.strokeRect(15, 15, 770, 770);

    // 3. Cabeçalho / Branding
    // Badge do Topo "FIFA WORLD CUP 2026"
    const badgeX = 240, badgeY = 40, badgeW = 320, badgeH = 46, badgeR = 10;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.strokeStyle = '#ffd439';
    ctx.lineWidth = 2.5;
    desenharRetanguloArredondado(ctx, badgeX, badgeY, badgeW, badgeH, badgeR, true, true);
    
    ctx.fillStyle = '#ffd439';
    ctx.font = '900 18px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏆  FIFA WORLD CUP 2026  🏆', 400, 69);

    // MEU PALPITE OFICIAL 📝
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 36px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillText('MEU PALPITE OFICIAL 📝', 400, 125);

    // Borda/Banner do Grupo
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    desenharRetanguloArredondado(ctx, 280, 150, 240, 32, 6, true, false);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '700 15px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillText(`GRUPO ${palpite.grupo.toUpperCase()} — RODADA ${palpite.rodada}`, 400, 171);

    // 4. Confronto / Seleções
    const selA = selecoes.find(s => s.nome.toLowerCase() === palpite.selecaoA.toLowerCase());
    const selB = selecoes.find(s => s.nome.toLowerCase() === palpite.selecaoB.toLowerCase());

    // Card da Esquerda (Time A)
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
    // Nome do Time A (com sombra)
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 24px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 3;
    ctx.fillText(palpite.selecaoA, 205, 395);
    ctx.shadowColor = 'transparent'; // Reset sombra

    // Card da Direita (Time B)
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
    // Nome do Time B (com sombra)
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 24px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 3;
    ctx.fillText(palpite.selecaoB, 595, 395);
    ctx.shadowColor = 'transparent'; // Reset sombra

    // Placar Central
    // Box Placar A
    ctx.fillStyle = '#0b0f19';
    ctx.strokeStyle = '#19c463';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(25, 196, 99, 0.3)';
    ctx.shadowBlur = 8;
    desenharRetanguloArredondado(ctx, 310, 255, 64, 86, 10, true, true);
    ctx.shadowColor = 'transparent'; // Reset
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 56px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillText(palpite.placar.selecaoA.toString(), 342, 319);

    // Separador central (Bola de futebol com "X")
    ctx.font = '48px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
    ctx.fillText('⚽', 400, 318);
    ctx.fillStyle = '#ffd439';
    ctx.font = 'bold italic 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('X', 400, 311);

    // Box Placar B
    ctx.fillStyle = '#0b0f19';
    ctx.strokeStyle = '#19c463';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(25, 196, 99, 0.3)';
    ctx.shadowBlur = 8;
    desenharRetanguloArredondado(ctx, 426, 255, 64, 86, 10, true, true);
    ctx.shadowColor = 'transparent'; // Reset
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 56px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillText(palpite.placar.selecaoB.toString(), 458, 319);

    // 5. Caixa Resumo do Palpite (Results Summary)
    const boxX = 200, boxY = 440, boxW = 400, boxH = 110, boxR = 14;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.strokeStyle = 'rgba(25, 196, 99, 0.3)';
    ctx.lineWidth = 2;
    desenharRetanguloArredondado(ctx, boxX, boxY, boxW, boxH, boxR, true, true);

    // Badge de Verificado (Círculo verde com checkmark branco)
    ctx.fillStyle = '#19c463';
    ctx.beginPath();
    ctx.arc(245, 475, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('✓', 245, 480);

    // Texto "Resumo do Palpite"
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 21px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Resumo do Palpite', 270, 482);

    // Balão "SUGESTÃO" no lado direito
    const tagX = 475, tagY = 463, tagW = 100, tagH = 26, tagR = 6;
    ctx.fillStyle = '#e2e8f0';
    ctx.textAlign = 'center';
    desenharRetanguloArredondado(ctx, tagX, tagY, tagW, tagH, tagR, true, false);
    ctx.fillStyle = '#1e293b';
    ctx.font = '800 10px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillText('SUGESTÃO', 525, 480);

    // Palpite Final: Vitória/Empate
    ctx.fillStyle = '#19c463';
    ctx.font = '800 23px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    const pickText = palpite.palpiteFinal === 'Empate' ? 'Empate' : `Vitória da ${palpite.palpiteFinal}`;
    ctx.fillText(`Palpite Final: ${pickText}`, 400, 528);

    // Sugestão do Quiz: Empate (Abaixo da caixa)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.font = '700 16px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    const sugText = palpite.resultadoSugerido === 'Empate' ? 'Empate' : `Vitória da ${palpite.resultadoSugerido}`;
    ctx.fillText(`Sugestão do Quiz: ${sugText}`, 400, 582);

    // 6. Chamada de Ação: Compartilhar
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 22px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillText('Compartilhe seu Palpite!', 400, 622);

    // Botão Compartilhar
    const btnX = 180, btnY = 640, btnW = 200, btnH = 40, btnR = 10;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
    desenharRetanguloArredondado(ctx, btnX, btnY, btnW, btnH, btnR, true, true);
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 13px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillText('COMPARTILHAR 📸 🐦 💬', 280, 665);

    // Desafie seus amigos
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '700 11px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('DESAFIE SEUS AMIGOS!', 400, 656);
    ctx.fillStyle = '#ffd439';
    ctx.font = '800 13px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillText('@copa2026', 400, 674);

    // 7. Rodapé do Card
    ctx.textAlign = 'center';
    // Emojis da Esquerda
    ctx.font = '38px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
    ctx.fillText('⚽🏆', 75, 742);

    // Texto Central
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '700 15px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillText('Monte seus palpites e divirta-se com a gente!', 400, 734);
    ctx.fillStyle = '#ffd439';
    ctx.font = '800 16px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillText('@copa2026', 400, 755);

    // Emojis da Direita
    ctx.font = '38px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
    ctx.fillText('🏆✨', 725, 742);
  }

  function desenharImagemArredondada(ctx, img, x, y, width, height, radius) {
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
  }

  function desenharRetanguloArredondado(ctx, x, y, width, height, radius, fill, stroke) {
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
  }

  function iniciarDownload(url) {
    const slugName = (n) => n.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `palpite-${slugName(palpite.selecaoA)}-vs-${slugName(palpite.selecaoB)}.png`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

function formatarNomeSelecaoParaTexto(nome) {
  if (nome === "República Tcheca") return "Rep. Tcheca";
  if (nome === "Bósnia e Herzegovina") return "Bósnia";
  return nome;
}

function gerarTextoPalpites() {
  const palpites = carregarPalpites();
  if (palpites.length === 0) return "";

  // Ordenar por grupo e depois rodada
  palpites.sort((a, b) => a.grupo.localeCompare(b.grupo) || a.rodada - b.rodada);

  let texto = "🏆 MEUS PALPITES — COPA 2026 🏆\n";
  texto += "Ganhe de mim se for capaz! 😉👇\n\n";

  let grupoRodadaAtual = "";

  palpites.forEach(p => {
    const key = `⚽ GRUPO ${p.grupo} (Rodada ${p.rodada})`;
    if (key !== grupoRodadaAtual) {
      if (grupoRodadaAtual !== "") {
        texto += "\n"; // Quebra de linha entre blocos de grupos/rodadas
      }
      texto += `${key}\n`;
      grupoRodadaAtual = key;
    }
    const nomeA = formatarNomeSelecaoParaTexto(p.selecaoA);
    const nomeB = formatarNomeSelecaoParaTexto(p.selecaoB);
    texto += `${nomeA} ${p.placar.selecaoA} x ${p.placar.selecaoB} ${nomeB}\n`;
  });

  // Determinar link do site
  let siteUrl = window.location.href.split('?')[0].split('#')[0];
  if (window.location.protocol === 'file:') {
    siteUrl = "copa2026palpites.com/palpites";
  }

  texto += "\n👉 Monte seus palpites e monte seu grupo também:\n";
  texto += `🔗 ${siteUrl}`;

  return texto;
}

function baixarPalpitesComoTexto() {
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
}

function compartilharNoWhatsApp() {
  const texto = gerarTextoPalpites();
  if (!texto) return;

  const urlShare = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
  window.open(urlShare, '_blank');
}
