import { codigoParaEmojiBandeira, desenharRetanguloArredondado } from "./predictionShare";

/**
 * Generates the sharing text for WhatsApp and Clipboard.
 * @param {Object} data - Simulation state data
 */
export function generateMyCupShareText(data) {
  if (!data || !data.champion) return "";

  const finalMatch = data.knockout?.final;
  const scoreText = finalMatch ? ` (${finalMatch.placarA} x ${finalMatch.placarB})` : "";

  let text = `🏆 Minha Copa dos Palpites 2026 🏆\n\n`;
  text += `🥇 Campeão: ${data.champion}\n`;
  text += `🥈 Vice-campeão: ${data.runnerUp}\n`;
  if (data.thirdPlace) {
    text += `🥉 3º Lugar: ${data.thirdPlace}\n`;
  }
  text += `\n⚽ Grande Final:\n${data.runnerUp} ${scoreText} ${data.champion}\n\n`;

  // Semifinalists
  const sfMatches = data.knockout?.semiFinals || [];
  if (sfMatches.length === 2) {
    const teams = [];
    sfMatches.forEach((m) => {
      teams.push(m.selecaoA, m.selecaoB);
    });
    text += `🏟️ Semifinalistas:\n${teams.join(", ")}\n\n`;
  }

  if (data.profile) {
    text += `🌀 Perfil da minha Copa: ${data.profile.nome}\n`;
    text += `"${data.profile.descricao}"\n\n`;
  }

  let siteUrl = window.location.href.split("?")[0].split("#")[0];
  if (window.location.protocol === "file:") {
    siteUrl = "copa2026palpites.com/minha-copa";
  }
  text += `👉 Monte a sua Copa também:\n🔗 ${siteUrl}`;

  return text;
}

/**
 * Draws the Champion Card on HTML5 Canvas.
 * 
 * DESIGN DE BLINDAGEM DE ANÚNCIOS (AD-SHIELDING CANVAS ISOLATION):
 * Este renderizador utiliza comandos diretos e programáticos no contexto 2D do Canvas (in-memory).
 * Não são utilizadas ferramentas de captura do DOM (como html2canvas ou assemelhados).
 * Desta forma, todas as áreas, scripts injetados do Google AdSense, tags <ins> ou banners (.ad-slot, .adsbygoogle)
 * que estejam visíveis no fluxo do PWA são COMPLETAMENTE IGNORADOS e ISOLADOS. O card de compartilhamento gerado
 * conterá única e exclusivamente a arte limpa do título, placar da final, posições e o perfil da Copa simulada.
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Object} data - Simulation state data
 * @param {Array} selecoes - List of team details (for resolving flags)
 * @param {string} layout - 'square' (800x800) or 'stories' (1080x1920)
 */
export function drawMyCupCardPNG(ctx, data, selecoes = [], layout = "square") {
  const isStories = layout === "stories";
  const width = isStories ? 1080 : 800;
  const height = isStories ? 1920 : 800;

  const getTeamEmoji = (name) => {
    const found = selecoes.find((s) => s.nome.toLowerCase() === name.toLowerCase());
    return found ? codigoParaEmojiBandeira(found.codigo) : "⚽";
  };

  // 1. Fundo Gradiente Escuro (Futebol Premium)
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, "#03140E");
  grad.addColorStop(0.5, "#082E20");
  grad.addColorStop(1, "#010a07");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 2. Linhas do Campo Decorativas (efeito sutil)
  ctx.strokeStyle = "rgba(0, 200, 83, 0.04)";
  ctx.lineWidth = isStories ? 6 : 4;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  // Círculo central
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, isStories ? 250 : 150, 0, Math.PI * 2);
  ctx.stroke();

  // 3. Moldura Dourada Realeza
  ctx.strokeStyle = "#FFD166";
  ctx.lineWidth = isStories ? 14 : 8;
  ctx.strokeRect(15, 15, width - 30, height - 30);

  // Cantos reforçados dourados
  ctx.fillStyle = "#FFD166";
  const cornerSize = isStories ? 40 : 25;
  ctx.fillRect(15, 15, cornerSize, cornerSize);
  ctx.fillRect(width - 15 - cornerSize, 15, cornerSize, cornerSize);
  ctx.fillRect(15, height - 15 - cornerSize, cornerSize, cornerSize);
  ctx.fillRect(width - 15 - cornerSize, height - 15 - cornerSize, cornerSize, cornerSize);

  // 4. Cabeçalho Principal
  ctx.textAlign = "center";
  ctx.fillStyle = "#FFD166";
  ctx.font = `900 ${isStories ? "32px" : "22px"} "Plus Jakarta Sans", sans-serif`;
  ctx.fillText("🏆  MINHA COPA DOS PALPITES 2026  🏆", width / 2, isStories ? 140 : 90);

  // 5. Visualização do Campeão (Troféu Gigante + Nome + Flag)
  const champY = isStories ? 320 : 210;
  ctx.fillStyle = "rgba(255, 209, 102, 0.08)";
  ctx.strokeStyle = "rgba(255, 209, 102, 0.35)";
  ctx.lineWidth = 3;
  const champBoxW = isStories ? 860 : 620;
  const champBoxH = isStories ? 380 : 220;
  const champBoxX = (width - champBoxW) / 2;
  desenharRetanguloArredondado(ctx, champBoxX, champY, champBoxW, champBoxH, 28, true, true);

  // Emojis e Troféu
  ctx.fillStyle = "#FFD166";
  ctx.font = `900 ${isStories ? "110px" : "80px"} "Segoe UI Emoji", sans-serif`;
  ctx.fillText("🏆", width / 2, champY + (isStories ? 130 : 95));

  // Nome do Campeão
  ctx.fillStyle = "#F8FAFC";
  ctx.font = `900 ${isStories ? "64px" : "42px"} "Plus Jakarta Sans", sans-serif`;
  const champEmoji = getTeamEmoji(data.champion);
  ctx.fillText(`${champEmoji} ${data.champion} ${champEmoji}`, width / 2, champY + (isStories ? 230 : 160));

  // Subtítulo CAMPEÃO MUNDIAL
  ctx.fillStyle = "#FFD166";
  ctx.font = `900 ${isStories ? "28px" : "18px"} "Plus Jakarta Sans", sans-serif`;
  ctx.fillText("CAMPEÃO DO MUNDIAL SIMULADO 2026", width / 2, champY + (isStories ? 285 : 195));

  // 6. Placar da Final e Posicionamento (Vice e 3º)
  const statsY = isStories ? 770 : 475;
  const statsW = isStories ? 860 : 620;
  const statsH = isStories ? 560 : 210;
  const statsX = (width - statsW) / 2;

  ctx.fillStyle = "rgba(15, 67, 48, 0.65)";
  ctx.strokeStyle = "rgba(0, 200, 83, 0.2)";
  ctx.lineWidth = 2;
  desenharRetanguloArredondado(ctx, statsX, statsY, statsW, statsH, 24, true, true);

  // Placar do Jogo
  const finalMatch = data.knockout?.final;
  const finalPlacarText = finalMatch
    ? `${finalMatch.selecaoA} ${finalMatch.placarA} x ${finalMatch.placarB} ${finalMatch.selecaoB}`
    : `${data.runnerUp} x ${data.champion}`;

  ctx.fillStyle = "#FFD166";
  ctx.font = `800 ${isStories ? "22px" : "14px"} "Plus Jakarta Sans", sans-serif`;
  ctx.fillText("O CONFRONTO DECISIVO", width / 2, statsY + (isStories ? 50 : 35));

  ctx.fillStyle = "#F8FAFC";
  ctx.font = `900 ${isStories ? "38px" : "24px"} "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(finalPlacarText, width / 2, statsY + (isStories ? 105 : 75));

  // Medalhas
  ctx.textAlign = "left";
  ctx.font = `700 ${isStories ? "24px" : "16px"} "Plus Jakarta Sans", sans-serif`;

  const viceEmoji = getTeamEmoji(data.runnerUp);
  ctx.fillStyle = "#E2E8F0";
  ctx.fillText(`🥈 VICE-CAMPEÃO: ${viceEmoji} ${data.runnerUp}`, statsX + 40, statsY + (isStories ? 190 : 120));

  if (data.thirdPlace) {
    const thirdEmoji = getTeamEmoji(data.thirdPlace);
    ctx.fillStyle = "#CD7F32";
    ctx.fillText(`🥉 3º COLOCADO: ${thirdEmoji} ${data.thirdPlace}`, statsX + 40, statsY + (isStories ? 250 : 160));
  }

  // Semifinalistas
  const sfMatches = data.knockout?.semiFinals || [];
  if (sfMatches.length === 2) {
    const sfTeams = [];
    sfMatches.forEach((m) => {
      if (m.selecaoA !== data.champion && m.selecaoA !== data.runnerUp) sfTeams.push(m.selecaoA);
      if (m.selecaoB !== data.champion && m.selecaoB !== data.runnerUp) sfTeams.push(m.selecaoB);
    });
    ctx.fillStyle = "#B7C9C0";
    ctx.font = `600 ${isStories ? "20px" : "14px"} "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(`🏟️ Semifinalistas eliminados: ${sfTeams.join(" e ")}`, statsX + 40, statsY + (isStories ? 320 : 185));
  }

  // Se Stories, adicionar o Perfil da Copa completo no card
  if (isStories && data.profile) {
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    const profCardY = statsY + 370;
    const profCardW = statsW - 80;
    const profCardH = 150;
    const profCardX = statsX + 40;
    desenharRetanguloArredondado(ctx, profCardX, profCardY, profCardW, profCardH, 16, true, true);

    ctx.fillStyle = "#FFD166";
    ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Perfil: ${data.profile.nome}`, width / 2, profCardY + 45);

    ctx.fillStyle = "#B7C9C0";
    ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(data.profile.descricao, width / 2, profCardY + 90, profCardW - 40);
  }

  // 7. Rodapé do Card
  ctx.textAlign = "center";
  const footerY = isStories ? height - 260 : height - 65;

  ctx.fillStyle = "#FFD166";
  ctx.font = `900 ${isStories ? "32px" : "20px"} "Plus Jakarta Sans", sans-serif`;
  ctx.fillText("MONTE A SUA TAMBÉM!", width / 2, footerY);

  ctx.fillStyle = "#B7C9C0";
  ctx.font = `700 ${isStories ? "20px" : "14px"} "Plus Jakarta Sans", sans-serif`;
  ctx.fillText("copa2026palpites.com/minha-copa", width / 2, footerY + (isStories ? 45 : 30));
}
