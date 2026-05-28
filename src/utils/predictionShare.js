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

/**
 * Desenha o Card no Canvas.
 * @param {CanvasRenderingContext2D} ctx 
 * @param {HTMLImageElement|null} imgA 
 * @param {HTMLImageElement|null} imgB 
 * @param {Object} palpite 
 * @param {Array} selecoes 
 * @param {string} layout 'square' (800x800) ou 'stories' (1080x1920)
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
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = isStories ? 5 : 3;

  if (!isStories) {
    ctx.strokeRect(150, 0, 500, 180);
    ctx.strokeRect(300, 0, 200, 60);
    ctx.beginPath();
    ctx.moveTo(40, 400);
    ctx.lineTo(760, 400);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(400, 400, 120, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeRect(150, 620, 500, 180);
    ctx.strokeRect(300, 740, 200, 60);
  } else {
    // Layout vertical: duas metades de campo no topo e base
    ctx.strokeRect(200, 0, 680, 300);
    ctx.strokeRect(200, 1620, 680, 300);
    ctx.beginPath();
    ctx.arc(540, 960, 200, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(50, 960);
    ctx.lineTo(1030, 960);
    ctx.stroke();
  }

  // 3. Moldura Dourada
  ctx.strokeStyle = '#FFD166';
  ctx.lineWidth = isStories ? 12 : 8;
  ctx.strokeRect(15, 15, width - 30, height - 30);

  // 4. Cabeçalho
  ctx.fillStyle = 'rgba(8, 41, 29, 0.9)';
  ctx.strokeStyle = '#FFD166';
  ctx.lineWidth = 2.5;
  const headerY = isStories ? 120 : 40;
  const headerW = isStories ? 480 : 320;
  const headerX = (width - headerW) / 2;
  desenharRetanguloArredondado(ctx, headerX, headerY, headerW, 46, 12, true, true);

  ctx.fillStyle = '#FFD166';
  ctx.font = '900 16px "Plus Jakarta Sans", "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🏆  COPA DO MUNDO FIFA 2026  🏆', width / 2, headerY + 29);

  // Título do Palpite
  ctx.fillStyle = '#F8FAFC';
  ctx.font = `900 ${isStories ? '48px' : '36px'} "Plus Jakarta Sans", sans-serif`;
  const titleY = isStories ? 240 : 125;
  ctx.fillText('MEU PALPITE OFICIAL 📝', width / 2, titleY);

  // Badge de Grupo e Rodada
  const groupBadgeY = isStories ? 320 : 150;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  desenharRetanguloArredondado(ctx, (width - 260) / 2, groupBadgeY, 260, 32, 6, true, false);
  ctx.fillStyle = '#B7C9C0';
  ctx.font = '800 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`GRUPO ${palpite.grupo.toUpperCase()} — RODADA ${palpite.rodada}`, width / 2, groupBadgeY + 21);

  // 5. Layout dos Escudos e Placar
  const matchCardY = isStories ? 420 : 210;
  const matchCardH = isStories ? 280 : 150;
  
  const escudoSize = isStories ? 160 : 120;
  const cardWidth = isStories ? 200 : 150;

  // Lado A
  const sideAX = isStories ? 120 : 130;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  desenharRetanguloArredondado(ctx, sideAX, matchCardY, cardWidth, matchCardH, 20, true, true);
  if (imgA) {
    desenharImagemArredondada(ctx, imgA, sideAX + (cardWidth - escudoSize) / 2, matchCardY + (matchCardH - escudoSize) / 2, escudoSize, escudoSize, 12);
  } else {
    const emojiA = codigoParaEmojiBandeira(selA?.codigo);
    ctx.font = `${isStories ? '120px' : '90px'} "Segoe UI Emoji", sans-serif`;
    ctx.fillText(emojiA, sideAX + cardWidth / 2, matchCardY + matchCardH / 2 + (isStories ? 35 : 25));
  }
  
  // Nome A
  ctx.fillStyle = '#F8FAFC';
  ctx.font = '900 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(palpite.selecaoA, sideAX + cardWidth / 2, matchCardY + matchCardH + 35);

  // Lado B
  const sideBX = isStories ? width - 120 - cardWidth : 520;
  desenharRetanguloArredondado(ctx, sideBX, matchCardY, cardWidth, matchCardH, 20, true, true);
  if (imgB) {
    desenharImagemArredondada(ctx, imgB, sideBX + (cardWidth - escudoSize) / 2, matchCardY + (matchCardH - escudoSize) / 2, escudoSize, escudoSize, 12);
  } else {
    const emojiB = codigoParaEmojiBandeira(selB?.codigo);
    ctx.font = `${isStories ? '120px' : '90px'} "Segoe UI Emoji", sans-serif`;
    ctx.fillText(emojiB, sideBX + cardWidth / 2, matchCardY + matchCardH / 2 + (isStories ? 35 : 25));
  }

  // Nome B
  ctx.fillText(palpite.selecaoB, sideBX + cardWidth / 2, matchCardY + matchCardH + 35);

  // Placar Caixa A e B
  const placarAY = matchCardY + (matchCardH - (isStories ? 100 : 86)) / 2;
  const placarW = isStories ? 72 : 64;
  const placarH = isStories ? 100 : 86;
  const placarGap = isStories ? 160 : 116;

  ctx.fillStyle = '#061A12';
  ctx.strokeStyle = '#00C853';
  ctx.lineWidth = 3;
  
  // Caixa A
  const boxAX = (width / 2) - placarGap / 2 - placarW / 2;
  desenharRetanguloArredondado(ctx, boxAX, placarAY, placarW, placarH, 12, true, true);
  ctx.fillStyle = '#F8FAFC';
  ctx.font = `900 ${isStories ? '64px' : '56px'} "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(palpite.placar.selecaoA.toString(), boxAX + placarW / 2, placarAY + (isStories ? 72 : 62));

  // VS no meio
  ctx.fillStyle = '#FFD166';
  ctx.font = 'bold italic 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('X', width / 2, placarAY + placarH / 2 + 7);

  // Caixa B
  ctx.fillStyle = '#061A12';
  const boxBX = (width / 2) + placarGap / 2 - placarW / 2;
  desenharRetanguloArredondado(ctx, boxBX, placarAY, placarW, placarH, 12, true, true);
  ctx.fillStyle = '#F8FAFC';
  ctx.font = `900 ${isStories ? '64px' : '56px'} "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(palpite.placar.selecaoB.toString(), boxBX + placarW / 2, placarAY + (isStories ? 72 : 62));

  // 6. Bloco de Resultados e Análises
  const detailsY = isStories ? 850 : 455;
  const detailsW = isStories ? 880 : 540;
  const detailsH = isStories ? 560 : 255;
  const detailsX = (width - detailsW) / 2;

  ctx.fillStyle = 'rgba(15, 67, 48, 0.7)';
  ctx.strokeStyle = 'rgba(0, 200, 83, 0.3)';
  ctx.lineWidth = 2.5;
  desenharRetanguloArredondado(ctx, detailsX, detailsY, detailsW, detailsH, 24, true, true);

  // Sub-badge: Tipo do Palpite
  ctx.fillStyle = palpite.tipoPalpite === 'detalhado' ? '#38BDF8' : '#FFD166';
  desenharRetanguloArredondado(ctx, detailsX + 30, detailsY + 25, 140, 26, 6, true, false);
  ctx.fillStyle = '#061A12';
  ctx.font = '900 11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(modoStr.toUpperCase(), detailsX + 100, detailsY + 42);

  // Nível de Confiança
  ctx.fillStyle = '#B7C9C0';
  ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`CONFIANÇA: ${palpite.nivelConfianca.toUpperCase()}`, detailsX + detailsW - 30, detailsY + 42);

  // Resultado Final Escolhido
  ctx.textAlign = 'center';
  ctx.fillStyle = '#00C853';
  ctx.font = `900 ${isStories ? '34px' : '26px'} "Plus Jakarta Sans", sans-serif`;
  const pickText = palpite.palpiteFinal === 'Empate' ? 'Palpite Final: Empate' : `Palpite Final: Vitória do ${palpite.palpiteFinal}`;
  ctx.fillText(pickText, width / 2, detailsY + (isStories ? 120 : 95));

  // Sugerido pelo questionário
  ctx.fillStyle = '#F8FAFC';
  ctx.font = '800 16px "Plus Jakarta Sans", sans-serif';
  const sugText = palpite.resultadoSugerido === 'Empate' ? 'Empate' : `Vitória do ${palpite.resultadoSugerido}`;
  ctx.fillText(`Sugestão da Análise: ${sugText}`, width / 2, detailsY + (isStories ? 175 : 135));

  // Pontuação Resumida
  ctx.fillStyle = '#B7C9C0';
  ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
  const pontResumo = `${palpite.selecaoA} ${palpite.pontuacao?.selecaoA ?? 0} · Empate ${palpite.pontuacao?.empate ?? 0} · ${palpite.selecaoB} ${palpite.pontuacao?.selecaoB ?? 0}`;
  ctx.fillText(pontResumo, width / 2, detailsY + (isStories ? 215 : 165));

  // Perfil do Palpiteiro Badge
  const profCardY = detailsY + (isStories ? 270 : 190);
  const profCardW = detailsW - 60;
  const profCardH = isStories ? 220 : 48;
  const profCardX = detailsX + 30;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1.5;
  desenharRetanguloArredondado(ctx, profCardX, profCardY, profCardW, profCardH, 14, true, true);

  if (!isStories) {
    // Layout horizontal do badge de perfil
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFD166';
    ctx.font = '900 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`${perfilIcon} Perfil: ${perfilStr}`, profCardX + 15, profCardY + 29);
  } else {
    // Layout vertical expandido para Stories
    ctx.fillStyle = '#FFD166';
    ctx.font = '900 48px "Segoe UI Emoji", sans-serif';
    ctx.fillText(perfilIcon, width / 2, profCardY + 65);

    ctx.fillStyle = '#FFD166';
    ctx.font = '900 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Perfil: ${perfilStr}`, width / 2, profCardY + 115);

    ctx.fillStyle = '#B7C9C0';
    ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
    
    // Desenhar descrição quebrada em linhas
    const desc = palpite.perfilPalpiteiro?.descricao || "Você olhou para o confronto com cuidado e dedicação.";
    ctx.fillText(desc, width / 2, profCardY + 160, profCardW - 40);
  }

  // 7. Rodapé do Card
  ctx.textAlign = 'center';
  const footerY = isStories ? height - 250 : height - 85;

  ctx.fillStyle = '#FFD166';
  ctx.font = '900 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('@copa2026', width / 2, footerY);

  ctx.fillStyle = '#B7C9C0';
  ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Monte seus palpites e divirta-se com a gente!', width / 2, footerY + 30);
  
  ctx.font = '38px "Segoe UI Emoji", sans-serif';
  ctx.fillText('⚽🏆', width / 2 - 190, footerY + 12);
  ctx.fillText('🏆✨', width / 2 + 190, footerY + 12);
}
