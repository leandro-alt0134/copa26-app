export function getPerguntasRapidas(partida) {
  const nameA = partida?.selecaoA || "Seleção A";
  const nameB = partida?.selecaoB || "Seleção B";
  return [
    {
      id: 'momento',
      titulo: 'Qual seleção chega em melhor momento?',
      categoriaName: 'momento recente',
      opcoes: [
        { texto: nameA, valor: nameA, pontos: 'A' },
        { texto: 'Equilibrado', valor: 'Empate', pontos: 'Empate' },
        { texto: nameB, valor: nameB, pontos: 'B' },
      ],
    },
    {
      id: 'ataque',
      titulo: 'Qual equipe parece ter o ataque mais perigoso?',
      categoriaName: 'força do ataque',
      opcoes: [
        { texto: nameA, valor: nameA, pontos: 'A' },
        { texto: 'Ataques equilibrados', valor: 'Empate', pontos: 'Empate' },
        { texto: nameB, valor: nameB, pontos: 'B' },
      ],
    },
    {
      id: 'defesa',
      titulo: 'Qual equipe parece mais segura defensivamente?',
      categoriaName: 'consistência defensiva',
      opcoes: [
        { texto: nameA, valor: nameA, pontos: 'A' },
        { texto: 'Defesas equilibradas', valor: 'Empate', pontos: 'Empate' },
        { texto: nameB, valor: nameB, pontos: 'B' },
      ],
    },
    {
      id: 'experiencia',
      titulo: 'Qual seleção tem mais tradição ou experiência em Copas?',
      categoriaName: 'tradição em Copas',
      opcoes: [
        { texto: nameA, valor: nameA, pontos: 'A' },
        { texto: 'As duas têm peso parecido', valor: 'Empate', pontos: 'Empate' },
        { texto: nameB, valor: nameB, pontos: 'B' },
      ],
    },
    {
      id: 'cenario',
      titulo: 'Qual cenário você acha mais provável para o jogo?',
      categoriaName: 'proposta de jogo',
      opcoes: [
        { texto: `${nameA} deve controlar mais a partida`, valor: nameA, pontos: 'A' },
        { texto: 'O jogo deve ser equilibrado', valor: 'Empate', pontos: 'Empate' },
        { texto: `${nameB} deve controlar mais a partida`, valor: nameB, pontos: 'B' },
      ],
    },
  ];
}

export function getPerguntasDetalhadas(partida) {
  const nameA = partida?.selecaoA || "Seleção A";
  const nameB = partida?.selecaoB || "Seleção B";
  return [
    {
      id: 'fase',
      titulo: 'Qual equipe chega em melhor fase nos últimos jogos?',
      categoriaName: 'fase recente',
      ajuda: 'Pense em quem venceu mais, perdeu menos ou vem jogando melhor recentemente.',
      opcoes: [
        { texto: nameA, valor: nameA, pontos: 'A' },
        { texto: 'Empate ou indefinido', valor: 'Empate', pontos: 'Empate' },
        { texto: nameB, valor: nameB, pontos: 'B' },
      ],
    },
    {
      id: 'elenco',
      titulo: 'Qual equipe parece ter o elenco mais forte ou equilibrado?',
      categoriaName: 'qualidade do elenco',
      ajuda: 'Considere titulares, banco de reservas e qualidade geral dos jogadores.',
      opcoes: [
        { texto: nameA, valor: nameA, pontos: 'A' },
        { texto: 'Empate ou indefinido', valor: 'Empate', pontos: 'Empate' },
        { texto: nameB, valor: nameB, pontos: 'B' },
      ],
    },
    {
      id: 'desfalques',
      titulo: 'Alguma das equipes parece sofrer menos com desfalques importantes?',
      categoriaName: 'situação médica/desfalques',
      ajuda: 'Lesões, suspensões ou ausências de titulares podem mudar bastante o jogo.',
      opcoes: [
        { texto: nameA, valor: nameA, pontos: 'A' },
        { texto: 'Empate ou indefinido', valor: 'Empate', pontos: 'Empate' },
        { texto: nameB, valor: nameB, pontos: 'B' },
      ],
    },
    {
      id: 'ataque_detalhado',
      titulo: 'Qual equipe tem o ataque mais confiável no momento?',
      categoriaName: 'ataque',
      ajuda: 'Pense em quem cria mais chances, marca gols com frequência ou tem atacantes em boa fase.',
      opcoes: [
        { texto: nameA, valor: nameA, pontos: 'A' },
        { texto: 'Empate ou indefinido', valor: 'Empate', pontos: 'Empate' },
        { texto: nameB, valor: nameB, pontos: 'B' },
      ],
    },
    {
      id: 'defesa_detalhada',
      titulo: 'Qual equipe passa mais segurança defensiva?',
      categoriaName: 'defesa',
      ajuda: 'Considere quem sofre menos gols, comete menos erros e parece mais organizada atrás.',
      opcoes: [
        { texto: nameA, valor: nameA, pontos: 'A' },
        { texto: 'Empate ou indefinido', valor: 'Empate', pontos: 'Empate' },
        { texto: nameB, valor: nameB, pontos: 'B' },
      ],
    },
    {
      id: 'fisico',
      titulo: 'Qual equipe parece chegar melhor fisicamente ou menos prejudicada pelo contexto?',
      categoriaName: 'preparo físico/contexto',
      ajuda: 'Leve em conta viagem, descanso, clima, altitude ou pressão da torcida.',
      opcoes: [
        { texto: nameA, valor: nameA, pontos: 'A' },
        { texto: 'Empate ou indefinido', valor: 'Empate', pontos: 'Empate' },
        { texto: nameB, valor: nameB, pontos: 'B' },
      ],
    },
    {
      id: 'tatico',
      titulo: 'Qual equipe parece mais organizada taticamente?',
      categoriaName: 'organização tática',
      ajuda: 'Pense em quem tem um plano de jogo mais claro e consegue se adaptar melhor.',
      opcoes: [
        { texto: nameA, valor: nameA, pontos: 'A' },
        { texto: 'Empate ou indefinido', valor: 'Empate', pontos: 'Empate' },
        { texto: nameB, valor: nameB, pontos: 'B' },
      ],
    },
    {
      id: 'ambiente',
      titulo: 'Qual equipe parece viver ambiente interno mais estável?',
      categoriaName: 'ambiente interno',
      ajuda: 'Ausência de crise, troca de técnico, pressão exagerada ou conflitos pode ajudar.',
      opcoes: [
        { texto: nameA, valor: nameA, pontos: 'A' },
        { texto: 'Empate ou indefinido', valor: 'Empate', pontos: 'Empate' },
        { texto: nameB, valor: nameB, pontos: 'B' },
      ],
    },
    {
      id: 'psicologico',
      titulo: 'Qual equipe parece menos abalada por derrotas ou eliminações recentes?',
      categoriaName: 'psicológico',
      ajuda: 'Uma goleada, eliminação ou derrota traumática pode afetar a confiança.',
      opcoes: [
        { texto: nameA, valor: nameA, pontos: 'A' },
        { texto: 'Empate ou indefinido', valor: 'Empate', pontos: 'Empate' },
        { texto: nameB, valor: nameB, pontos: 'B' },
      ],
    },
    {
      id: 'decisivo',
      titulo: 'Qual equipe tem o jogador mais capaz de decidir a partida sozinho?',
      categoriaName: 'jogador decisivo',
      ajuda: 'Considere craques em boa fase, goleadores, jogadores de bola parada, goleiros decisivos ou líderes técnicos.',
      opcoes: [
        { texto: nameA, valor: nameA, pontos: 'A' },
        { texto: 'Empate ou indefinido', valor: 'Empate', pontos: 'Empate' },
        { texto: nameB, valor: nameB, pontos: 'B' },
      ],
    },
  ];
}

export function calcularPontuacao(respostas, perguntas) {
  let pontosA = 0;
  let pontosB = 0;
  let pontosEmpate = 0;

  perguntas.forEach((p) => {
    const respValor = respostas[p.id];
    const opcao = p.opcoes.find((opt) => opt.valor === respValor);
    if (opcao) {
      if (opcao.pontos === 'A') pontosA++;
      else if (opcao.pontos === 'B') pontosB++;
      else pontosEmpate++;
    }
  });

  return { pontosA, pontosB, pontosEmpate };
}

export function calcularNivelConfianca(pontuacao, tipoPalpite) {
  const { pontosA, pontosB, pontosEmpate } = pontuacao;
  const scores = [pontosA, pontosB, pontosEmpate].sort((a, b) => b - a);
  const diff = scores[0] - scores[1];

  if (diff === 0) {
    return 'Confronto equilibrado';
  }

  if (tipoPalpite === 'rapido') {
    return diff >= 3 ? 'Tendência forte' : 'Tendência leve';
  } else {
    if (diff >= 4) return 'Favoritismo claro';
    if (diff >= 2) return 'Favoritismo moderado';
    return 'Leve vantagem';
  }
}

export function gerarDescricaoResultado(pontuacao, partidaAtual, respostas, tipoPalpite) {
  const { pontosA, pontosB, pontosEmpate } = pontuacao;
  const nameA = partidaAtual.selecaoA;
  const nameB = partidaAtual.selecaoB;
  
  if (pontosA > pontosB && pontosA > pontosEmpate) {
    const aspectos = obterAspectosVencedores(respostas, 'A', partidaAtual, tipoPalpite);
    const aspectosTexto = formatarListaAspectos(aspectos);
    return `Sua análise indicou vantagem para o <strong>${nameA}</strong>${aspectosTexto ? ` principalmente por <strong>${aspectosTexto}</strong>` : ''}.`;
  } else if (pontosB > pontosA && pontosB > pontosEmpate) {
    const aspectos = obterAspectosVencedores(respostas, 'B', partidaAtual, tipoPalpite);
    const aspectosTexto = formatarListaAspectos(aspectos);
    return `Sua análise indicou vantagem para a <strong>${nameB}</strong>${aspectosTexto ? ` principalmente por <strong>${aspectosTexto}</strong>` : ''}.`;
  } else {
    return `O confronto ficou bem equilibrado pelas suas respostas. Seu palpite final pode depender mais do placar que você imagina para o jogo.`;
  }
}

function obterAspectosVencedores(respostas, ladoVencedor, partidaAtual, tipoPalpite) {
  const perguntas = tipoPalpite === 'rapido' ? getPerguntasRapidas(partidaAtual) : getPerguntasDetalhadas(partidaAtual);
  const aspectos = [];

  perguntas.forEach((p) => {
    const resp = respostas[p.id];
    const opcaoSelected = p.opcoes.find(o => o.valor === resp);
    if (opcaoSelected && opcaoSelected.pontos === ladoVencedor) {
      aspectos.push(p.categoriaName);
    }
  });

  return aspectos.slice(0, 3); // Retorna no máximo os 3 principais fatores
}

function formatarListaAspectos(lista) {
  if (lista.length === 0) return '';
  if (lista.length === 1) return lista[0];
  if (lista.length === 2) return `${lista[0]} e ${lista[1]}`;
  return `${lista[0]}, ${lista[1]} e ${lista[2]}`;
}
