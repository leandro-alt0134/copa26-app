export function gerarFraseCompartilhamento(palpite) {
  const { selecaoA, selecaoB, placar, tipoPalpite, nivelConfianca, perfilPalpiteiro, palpiteFinal } = palpite;
  const modoStr = tipoPalpite === 'detalhado' ? 'Detalhado' : 'Rápido';
  const perfilStr = typeof perfilPalpiteiro === 'object' ? perfilPalpiteiro.nome : perfilPalpiteiro;

  const resultadoPlacar = `${placar.selecaoA}x${placar.selecaoB}`;
  
  if (palpiteFinal === 'Empate') {
    return `Meu palpite para ${selecaoA} x ${selecaoB} é ${resultadoPlacar} ⚽🏆\nFiz no modo ${modoStr} e o jogo ficou com cara de empate.\nMeu perfil: ${perfilStr}.\nE você, concorda?`;
  } else {
    return `Meu palpite para ${selecaoA} x ${selecaoB} é ${resultadoPlacar} para o ${palpiteFinal} ⚽🏆\nFiz no modo ${modoStr} e deu ${nivelConfianca}.\nMeu perfil: ${perfilStr}.\nE você, concorda?`;
  }
}

export function codigoParaEmojiBandeira(codigo) {
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
}

export function desenharRetanguloArredondado(ctx, x, y, width, height, radius, fill, stroke) {
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

export function desenharImagemArredondada(ctx, img, x, y, width, height, radius) {
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

// Função auxiliar essencial para evitar quebra de layout de texto corrido no Canvas
function desenharTextoComQuebra(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let metrics = ctx.measureText(testLine);
    let testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}

/**
 * Desenha o Card no Canvas Otimizado para UI/UX
 */
export function desenharCardPNG(ctx, imgA, imgB, palpite, selecoes, layout = 'square') {
  const isStories = layout === 'stories';
  const width = isStories ? 1080 : 800;
  const height = isStories ? 1920 : 800;

  const selA = selecoes.find((s) => s.nome.toLowerCase() === palpite.selecaoA.toLowerCase());
  const selB = selecoes.find((s) => s.nome.toLowerCase() === palpite.selecaoB.toLowerCase());

  const perfilStr = typeof palpite.perfilPalpiteiro === 'object' ? palpite.perfilPalpiteiro.nome : palpite.perfilPalpiteiro;
  const perfilIcon = typeof palpite.perfilPalpiteiro === 'object' ? palpite.perfilPalpiteiro.icone : '⚽';
  const modoStr = palpite.tipoPalpite === 'detalhado' ? 'Palpite Detalhado' : 'Palpite Rápido';

  // 1. Fundo Gradiente Escuro
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#061A12');
  grad.addColorStop(0.5, '#08291D');
  grad.addColorStop(1, '#020b08');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 2. Linhas do Campo (efeito futebol)
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = isStories ? 5 : 3;

  if (!isStories) {
    ctx.strokeRect(150, 0, 500, 160);
    ctx.strokeRect(300, 0, 200, 50);
    ctx.beginPath();
    ctx.moveTo(40, 400);
    ctx.lineTo(760, 400);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(400, 400, 110, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeRect(150, 640, 500, 160);
    ctx.strokeRect(300, 750, 200, 50);
  } else {
    ctx.strokeRect(180, 0, 720, 280);
    ctx.strokeRect(180, 1640, 720, 280);
    ctx.beginPath();
    ctx.arc(540, 960, 180, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(50, 960);
    ctx.lineTo(1030, 960);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Moldura Dourada
  ctx.strokeStyle = '#FFD166';
  ctx.lineWidth = isStories ? 12 : 8;
  ctx.strokeRect(15, 15, width - 30, height - 30);

  // 4. Cabeçalho Dinâmico
  ctx.fillStyle = 'rgba(8, 41, 29, 0.95)';
  ctx.strokeStyle = '#FFD166';
  ctx.lineWidth = 2.5;
  const headerY = isStories ? 100 : 35; 
  const headerW = isStories ? 480 : 320;
  const headerX = (width - headerW) / 2;
  desenharRetanguloArredondado(ctx, headerX, headerY, headerW, 46, 12, true, true);

  ctx.fillStyle = '#FFD166';
  ctx.font = '900 16px "Plus Jakarta Sans", "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🏆  COPA DO MUNDO FIFA 2026  🏆', width / 2, headerY + 29);

  // Título do Palpite
  ctx.fillStyle = '#F8FAFC';
  ctx.font = `900 ${isStories ? '48px' : '34px'} "Plus Jakarta Sans", sans-serif`;
  const titleY = isStories ? 210 : 115;
  ctx.fillText('MEU PALPITE OFICIAL 📝', width / 2, titleY);

  // Badge de Grupo e Rodada
  const groupBadgeY = isStories ? 280 : 140;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  desenharRetanguloArredondado(ctx, (width - 260) / 2, groupBadgeY, 260, 32, 6, true, false);
  ctx.fillStyle = '#B7C9C0';
  ctx.font = '800 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`GRUPO ${palpite.grupo.toUpperCase()} — RODADA ${palpite.rodada}`, width / 2, groupBadgeY + 21);

  // 5. Layout dos Escudos e Placar (Ajustado Y para evitar empurrar o rodapé)
  const matchCardY = isStories ? 370 : 195;
  const matchCardH = isStories ? 260 : 130;
  const escudoSize = isStories ? 150 : 105;
  const cardWidth = isStories ? 190 : 135;

  // Lado A
  const sideAX = isStories ? 120 : 130;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  desenharRetanguloArredondado(ctx, sideAX, matchCardY, cardWidth, matchCardH, 20, true, true);
  if (imgA) {
    desenharImagemArredondada(ctx, imgA, sideAX + (cardWidth - escudoSize) / 2, matchCardY + (matchCardH - escudoSize) / 2, escudoSize, escudoSize, 12);
  } else {
    const emojiA = codigoParaEmojiBandeira(selA?.codigo);
    ctx.font = `${isStories ? '110px' : '80px'} "Segoe UI Emoji", sans-serif`;
    ctx.fillText(emojiA, sideAX + cardWidth / 2, matchCardY + matchCardH / 2 + (isStories ? 35 : 25));
  }
  
  // Nome A com Text-Shadow para não sumir nas linhas brancas
  ctx.save();
  ctx.fillStyle = '#F8FAFC';
  ctx.font = '900 22px "Plus Jakarta Sans", sans-serif';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 4;
  ctx.fillText(palpite.selecaoA, sideAX + cardWidth / 2, matchCardY + matchCardH + 32);
  ctx.restore();

  // Lado B
  const sideBX = isStories ? width - 120 - cardWidth : 535;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  desenharRetanguloArredondado(ctx, sideBX, matchCardY, cardWidth, matchCardH, 20, true, true);
  if (imgB) {
    desenharImagemArredondada(ctx, imgB, sideBX + (cardWidth - escudoSize) / 2, matchCardY + (matchCardH - escudoSize) / 2, escudoSize, escudoSize, 12);
  } else {
    const emojiB = codigoParaEmojiBandeira(selB?.codigo);
    ctx.font = `${isStories ? '110px' : '80px'} "Segoe UI Emoji", sans-serif`;
    ctx.fillText(emojiB, sideBX + cardWidth / 2, matchCardY + matchCardH / 2 + (isStories ? 35 : 25));
  }

  // Nome B com Text-Shadow
  ctx.save();
  ctx.fillStyle = '#F8FAFC';
  ctx.font = '900 22px "Plus Jakarta Sans", sans-serif';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 4;
  ctx.fillText(palpite.selecaoB, sideBX + cardWidth / 2, matchCardY + matchCardH + 32);
  ctx.restore();

  // Placar Caixa A e B
  const placarAY = matchCardY + (matchCardH - (isStories ? 96 : 76)) / 2;
  const placarW = isStories ? 72 : 58;
  const placarH = isStories ? 96 : 76;
  const placarGap = isStories ? 160 : 110;

  ctx.fillStyle = '#061A12';
  ctx.strokeStyle = '#00C853';
  ctx.lineWidth = 3;
  
  // Caixa A
  const boxAX = (width / 2) - placarGap / 2 - placarW / 2;
  desenharRetanguloArredondado(ctx, boxAX, placarAY, placarW, placarH, 12, true, true);
  ctx.fillStyle = '#F8FAFC';
  ctx.font = `900 ${isStories ? '60px' : '48px'} "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(palpite.placar.selecaoA.toString(), boxAX + placarW / 2, placarAY + (isStories ? 68 : 54));

  // VS no meio
  ctx.fillStyle = '#FFD166';
  ctx.font = 'bold italic 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('X', width / 2, placarAY + placarH / 2 + 7);

  // Caixa B
  ctx.fillStyle = '#061A12';
  const boxBX = (width / 2) + placarGap / 2 - placarW / 2;
  desenharRetanguloArredondado(ctx, boxBX, placarAY, placarW, placarH, 12, true, true);
  ctx.fillStyle = '#F8FAFC';
  ctx.font = `900 ${isStories ? '60px' : '48px'} "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(palpite.placar.selecaoB.toString(), boxBX + placarW / 2, placarAY + (isStories ? 68 : 54));

  // 6. Bloco de Resultados e Análises (Recalculado alturas e margens para caber perfeitamente no Square)
  const detailsY = isStories ? 760 : 385; 
  const detailsW = isStories ? 880 : 560;
  const detailsH = isStories ? 640 : 225; // Reduzido ligeiramente no Square para dar respiro
  const detailsX = (width - detailsW) / 2;

  ctx.fillStyle = 'rgba(15, 67, 48, 0.8)';
  ctx.strokeStyle = 'rgba(0, 200, 83, 0.3)';
  ctx.lineWidth = 2.5;
  desenharRetanguloArredondado(ctx, detailsX, detailsY, detailsW, detailsH, 24, true, true);

  // Sub-badge: Tipo do Palpite
  ctx.fillStyle = palpite.tipoPalpite === 'detalhado' ? '#38BDF8' : '#FFD166';
  desenharRetanguloArredondado(ctx, detailsX + 25, detailsY + 20, 140, 26, 6, true, false);
  ctx.fillStyle = '#061A12';
  ctx.font = '900 11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(modoStr.toUpperCase(), detailsX + 95, detailsY + 37);

  // Nível de Confiança
  ctx.fillStyle = '#B7C9C0';
  ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`CONFIANÇA: ${palpite.nivelConfianca.toUpperCase()}`, detailsX + detailsW - 25, detailsY + 37);

  // Resultado Final Escolhido
  ctx.textAlign = 'center';
  ctx.fillStyle = '#00C853';
  ctx.font = `900 ${isStories ? '34px' : '24px'} "Plus Jakarta Sans", sans-serif`;
  const pickText = palpite.palpiteFinal === 'Empate' ? 'Palpite Final: Empate' : `Palpite Final: Vitória do ${palpite.palpiteFinal}`;
  ctx.fillText(pickText, width / 2, detailsY + (isStories ? 110 : 80));

  // Sugerido pelo questionário
  ctx.fillStyle = '#F8FAFC';
  ctx.font = '800 16px "Plus Jakarta Sans", sans-serif';
  const sugText = palpite.resultadoSugerido === 'Empate' ? 'Empate' : `Vitória do ${palpite.resultadoSugerido}`;
  ctx.fillText(`Sugestão da Análise: ${sugText}`, width / 2, detailsY + (isStories ? 165 : 115));

  // Pontuação Resumida
  ctx.fillStyle = '#B7C9C0';
  ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
  const pontResumo = `${palpite.selecaoA} ${palpite.pontuacao?.selecaoA ?? 0} · Empate ${palpite.pontuacao?.empate ?? 0} · ${palpite.selecaoB} ${palpite.pontuacao?.selecaoB ?? 0}`;
  ctx.fillText(pontResumo, width / 2, detailsY + (isStories ? 205 : 145));

  // Perfil do Palpiteiro Badge
  const profCardY = detailsY + (isStories ? 260 : 165);
  const profCardW = detailsW - 50;
  const profCardH = isStories ? 340 : 44;
  const profCardX = detailsX + 25;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1.5;
  desenharRetanguloArredondado(ctx, profCardX, profCardY, profCardW, profCardH, 14, true, true);

  if (!isStories) {
    // Layout horizontal do badge de perfil (Square)
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFD166';
    ctx.font = '900 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`${perfilIcon} Perfil: ${perfilStr}`, profCardX + 15, profCardY + 26);
  } else {
    // Layout vertical expandido para Stories (com correção de quebra de texto)
    ctx.fillStyle = '#FFD166';
    ctx.font = '900 52px "Segoe UI Emoji", sans-serif';
    ctx.fillText(perfilIcon, width / 2, profCardY + 75);

    ctx.fillStyle = '#FFD166';
    ctx.font = '900 26px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Perfil: ${perfilStr}`, width / 2, profCardY + 130);

    ctx.fillStyle = '#B7C9C0';
    ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
    
    const desc = palpite.perfilPalpiteiro?.descricao || "Você enxerga uma superioridade clara e está extremamente confiante na vitória do seu time.";
    // Chamada da nova função de wrap text para evitar o estouro de borda
    desenharTextoComQuebra(ctx, desc, width / 2, profCardY + 180, profCardW - 60, 24);
  }

  // 7. Rodapé do Card (Posicionado perfeitamente sem colisões)
  ctx.textAlign = 'center';
  const footerY = isStories ? height - 200 : height - 70;

  ctx.fillStyle = '#FFD166';
  ctx.font = '900 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('@copa2026', width / 2, footerY);

  ctx.fillStyle = '#B7C9C0';
  ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Monte seus palpites e divirta-se com a gente!', width / 2, footerY + 28);
  
  ctx.font = '36px "Segoe UI Emoji", sans-serif';
  ctx.fillText('⚽🏆', width / 2 - 190, footerY + 10);
  ctx.fillText('🏆✨', width / 2 + 190, footerY + 10);
}