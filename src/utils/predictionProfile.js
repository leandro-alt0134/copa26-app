export function gerarPerfilPalpiteiro(respostas, palpiteFinal, sugestao, partidaAtual) {
  const { pontosA, pontosB, pontosEmpate, resultadoSugerido, totalPerguntas } = sugestao;
  const nameA = partidaAtual?.selecaoA;
  const nameB = partidaAtual?.selecaoB;

  // 1. Fiel ao Empate
  if (palpiteFinal === "Empate") {
    return {
      nome: "Fiel ao Empate",
      icone: "🤝",
      descricao: "Você acredita que o equilíbrio vai prevalecer em campo e nenhum lado vai sobressair."
    };
  }

  // 2. Torcedor Raiz
  // Se o usuário contrariou a sugestão calculada pelo questionário
  if (palpiteFinal !== resultadoSugerido) {
    return {
      nome: "Torcedor Raiz",
      icone: "🥁",
      descricao: "Você ignora a análise calculada e confia no seu coração ou feeling de torcedor para o palpite final."
    };
  }

  // 3. Caçador de Zebras
  // Se a pontuação sugerida deu Empate ou o outro time, mas o usuário escolheu um vencedor, ou a diferença é muito apertada
  const scoreDiff = Math.abs(pontosA - pontosB);
  if (palpiteFinal !== "Empate" && (scoreDiff <= 1 || resultadoSugerido === "Empate")) {
    return {
      nome: "Caçador de Zebras",
      icone: "🦓",
      descricao: "Você gosta de arriscar em confrontos parelhos e aposta que a surpresa ou superação vai acontecer."
    };
  }

  // 4. Torcedor Confiante
  // Se escolheu muitas respostas favoráveis a uma seleção e votou nela no final
  const pontosVencedor = palpiteFinal === nameA ? pontosA : pontosB;
  if (pontosVencedor >= (totalPerguntas * 0.6)) {
    return {
      nome: "Torcedor Confiante",
      icone: "🔥",
      descricao: "Você enxerga uma superioridade clara e está extremamente confiante na vitória do seu time."
    };
  }

  // 5. Estrategista
  // Se usa o modo detalhado e a pontuação ficou distribuída (ou seja, não muito concentrada)
  if (totalPerguntas === 10) {
    return {
      nome: "Estrategista",
      icone: "🧠",
      descricao: "Você usou o modo detalhado e analisou minuciosamente o contexto tático, físico e emocional das seleções."
    };
  }

  // 6. Analista Cauteloso (Default / Fallback)
  return {
    nome: "Analista Cauteloso",
    icone: "📊",
    descricao: "Você olhou para o confronto com cuidado e percebeu equilíbrio em vários pontos do jogo."
  };
}
