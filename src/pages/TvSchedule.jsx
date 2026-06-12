import React, { useState, useEffect, useRef } from 'react';
import { carregarPartidasAtualizadas } from '../utils/predictionStorage';

// Função utilitária para formatar/abreviar nomes longos de seleções,
// garantindo que não ocorram quebras de layout na visualização web e no canvas.
const formatarNomeSelecao = (nome) => {
  if (!nome) return '';
  const n = nome.trim();
  const lower = n.toLowerCase();
  if (lower === 'república tcheca') return 'Rep. Tcheca';
  if (lower === 'bósnia e herzegovina') return 'Bósnia';
  if (lower === 'estados unidos') return 'EUA';
  if (lower === 'arábia saudita') return 'Arab. Saudita';
  if (lower === 'árfrica do sul' || lower === 'áfrica do sul') return 'Áfr. do Sul';
  if (lower === 'coreia do sul') return 'Cor. do Sul';
  return n;
};

export default function TvSchedule() {
  const [partidas, setPartidas] = useState([]);
  const [gerandoDownload, setGerandoDownload] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Carrega do cache local ou busca o arquivo estático
    const localCachedMatches = carregarPartidasAtualizadas();
    if (localCachedMatches && localCachedMatches.length > 0) {
      setPartidas(localCachedMatches);
    } else {
      fetch('/data/partidas.json')
        .then((res) => res.json())
        .then((data) => setPartidas(data || []))
        .catch((err) => console.error('Erro ao carregar partidas para agenda:', err));
    }
  }, []);

  // Formata a string ISO para o formato de dia da semana simplificado (EX: QUI 11/06)
  const formatarDataAgenda = (dataStr) => {
    if (!dataStr) return '';
    const dias = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
    const data = new Date(dataStr + 'T12:00:00'); // Evita problemas de timezone
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    return `${dias[data.getDay()]} ${dia}/${mes}`;
  };

  // Simula a lógica de mapeamento de canais com base nos grupos (simulando a imagem de referência)
  const obterCanaisTransmissao = (grupo) => {
    const canaisComuns = ['Cazé TV'];
    if (['A', 'C', 'D', 'F', 'I', 'J', 'L'].includes(grupo)) {
      return [...canaisComuns, 'GE / Sportv', 'SBT'];
    }
    return canaisComuns;
  };

  // Divide o array total de partidas em duas colunas equivalentes (Bloco 1 e Bloco 2)
  const metade = Math.ceil(partidas.length / 2);
  const colunaEsquerda = partidas.slice(0, metade);
  const colunaDireita = partidas.slice(metade);

  // Função auxiliar para desenhar bandeiras com bordas personalizadas no Canvas
  const desenharBandeiraCanvas = (ctx, img, x, y, w, h, isLeft) => {
    if (!img) return;
    ctx.save();
    ctx.beginPath();
    
    // Radii personalizados simulando o design: arredondamento maior nas pontas que se conectam ou bordas dinâmicas
    const radii = isLeft ? [8, 2, 24, 8] : [2, 8, 8, 24];
    
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, w, h, radii);
    } else {
      ctx.rect(x, y, w, h);
    }
    ctx.clip();
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();

    // Borda verde sutil ao redor da bandeira
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 200, 83, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, w, h, radii);
    } else {
      ctx.rect(x, y, w, h);
    }
    ctx.stroke();
    ctx.restore();
  };

  // Carrega todas as imagens das bandeiras de forma assíncrona para o Canvas
  const carregarImagensBandeiras = (jogos) => {
    const urlsUnicas = new Set();
    jogos.forEach((p) => {
      if (p.bandeiraA) urlsUnicas.add(p.bandeiraA);
      if (p.bandeiraB) urlsUnicas.add(p.bandeiraB);
    });

    const promessas = Array.from(urlsUnicas).map((url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ url, img });
        img.onerror = () => resolve({ url, img: null });
        img.src = '/' + url;
      });
    });

    return Promise.all(promessas).then((resultados) => {
      const cache = {};
      resultados.forEach((res) => {
        if (res.img) cache[res.url] = res.img;
      });
      return cache;
    });
  };

  // GERAÇÃO DO INFOGRÁFICO VIA CANVAS PARA DOWNLOAD
  const handleDownloadInfografico = async () => {
    setGerandoDownload(true);
    try {
      // Garante que todas as fontes (incluindo Plus Jakarta Sans local) estejam prontas antes de desenhar e medir texto
      if (document.fonts && typeof document.fonts.ready !== 'undefined') {
        await document.fonts.ready;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Carrega as bandeiras em cache antes de desenhar
      const cacheBandeiras = await carregarImagensBandeiras(partidas);
      window.cacheBandeirasDebug = cacheBandeiras;

      // Dimensões de alta definição baseadas na imagem (Largura x Altura)
      const w = 1200;
      const h = 1850;
      canvas.width = w;
      canvas.height = h;

      // 1. Fundo Vermelho Sólido de Borda
      ctx.fillStyle = '#C8102E'; 
      ctx.fillRect(0, 0, w, h);

      // 2. Banner de Fundo Escuro Central
      ctx.fillStyle = '#061A12';
      ctx.fillRect(20, 100, w - 40, h - 220);

      // 3. Cabeçalho Principal (Preto)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, 80);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 24px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AGENDA BOLA ROLANDO - MUNDIAL DE FUTEBOL 2026 - FASE DE GRUPOS', w / 2, 48);

      // 4. Desenho das Linhas de Jogos (Loop das Colunas)
      const renderizarColunaCanvas = (jogos, startX) => {
        let currentY = 120;
        const rowH = 44;
        const rowW = 540;

        jogos.forEach((jogo) => {
          // Fundo Branco da Linha
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(startX, currentY, rowW, rowH);

          // Caixa de Data/Hora (Fundo Escuro)
          ctx.fillStyle = '#0F291E';
          ctx.fillRect(startX, currentY, 95, rowH);

          // Texto de Data e Hora
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '900 12px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(formatarDataAgenda(jogo.data), startX + 47, currentY + 18);
          ctx.fillStyle = '#FFD166';
          ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
          ctx.fillText(`${jogo.horario || '00:00'} BRT`, startX + 47, currentY + 34);

          // Canais de Transmissão (Alinhados à direita)
          ctx.fillStyle = '#475569'; // Cinza escuro discreto
          ctx.font = '900 10px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'right';
          const canais = obterCanaisTransmissao(jogo.grupo).join(' · ');
          const channelsX = startX + rowW - 10;
          ctx.fillText(canais, channelsX, currentY + 27);

          // Medição do espaço disponível para a partida
          const channelsWidth = ctx.measureText(canais).width;
          const leftLimit = startX + 95; // Fim do bloco de data/hora
          const rightLimit = channelsX - channelsWidth - 10; // Início do bloco de canais com margem
          const availableSpace = rightLimit - leftLimit;

          // Posição central do confronto textual baseada no espaço livre
          const centerX = leftLimit + (availableSpace / 2);

          // Formata os nomes das seleções para evitar nomes muito longos no Canvas
          const selecaoAFormatada = formatarNomeSelecao(jogo.selecaoA).toUpperCase();
          const selecaoBFormatada = formatarNomeSelecao(jogo.selecaoB).toUpperCase();
          const confrontoTexto = `${selecaoAFormatada} - ${selecaoBFormatada}`;

          // Define o tamanho da fonte dinamicamente com base no texto e no espaço disponível
          ctx.fillStyle = '#000000';
          let fontSize = 12.5;
          ctx.font = `800 ${fontSize}px "Plus Jakarta Sans", sans-serif`;
          let textWidth = ctx.measureText(confrontoTexto).width;

          // Se o confronto com flags não couber no espaço, reduz o tamanho da fonte
          const flagSpaceRequired = 34 * 2 + 16; // Duas bandeiras de 34px + margem
          if (textWidth + flagSpaceRequired > availableSpace) {
            fontSize = 11.5;
            ctx.font = `800 ${fontSize}px "Plus Jakarta Sans", sans-serif`;
            textWidth = ctx.measureText(confrontoTexto).width;
            
            // Se ainda não couber, reduz mais para garantir segurança visual
            if (textWidth + flagSpaceRequired > availableSpace) {
              fontSize = 10;
              ctx.font = `800 ${fontSize}px "Plus Jakarta Sans", sans-serif`;
              textWidth = ctx.measureText(confrontoTexto).width;
            }
          }

          ctx.textAlign = 'center';
          ctx.fillText(confrontoTexto, centerX, currentY + 27);

          // Desenhar Bandeira A (Esquerda)
          const imgA = cacheBandeiras[jogo.bandeiraA];
          if (imgA) {
            const flagW = 34;
            const flagH = 22;
            const flagX = centerX - (textWidth / 2) - flagW - 8;
            const flagY = currentY + (rowH - flagH) / 2;
            desenharBandeiraCanvas(ctx, imgA, flagX, flagY, flagW, flagH, true);
          }

          // Desenhar Bandeira B (Direita)
          const imgB = cacheBandeiras[jogo.bandeiraB];
          if (imgB) {
            const flagW = 34;
            const flagH = 22;
            const flagX = centerX + (textWidth / 2) + 8;
            const flagY = currentY + (rowH - flagH) / 2;
            desenharBandeiraCanvas(ctx, imgB, flagX, flagY, flagW, flagH, false);
          }

          currentY += rowH + 6; // Espaçamento entre as linhas
        });
      };

      // Executa a renderização das duas colunas no Canvas
      renderizarColunaCanvas(colunaEsquerda, 40);
      renderizarColunaCanvas(colunaDireita, 620);

      // 5. Rodapé do Infográfico
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, h - 100, w, 100);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 20px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('INFORMATIVO REALIZADO PELO PALPITARIA DA COPA - @mongrel_tech', w / 2, h - 45);

      // Trigger de Download do Arquivo gerado
      const link = document.createElement('a');
      link.download = 'agenda-transmissao-copa2026.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Erro ao gerar infográfico:', err);
    } finally {
      setGerandoDownload(false);
    }
  };

  return (
    <main className="container pb-5 text-white">
      <section className="d-flex flex-wrap justify-content-between align-items-center my-4 gap-3">
        <div>
          <span className="hero-badge mb-2 d-inline-block">📺 Guia de Transmissões</span>
          <h1 className="app-title-footer">Agenda Pronta para Salvar</h1>
          <p className="text-muted small mb-0">Veja onde assistir cada confronto e baixe o guia de bolso independente para o seu celular.</p>
        </div>
        <button 
          className="btn btn-warning px-4 py-2 font-weight-bold" 
          onClick={handleDownloadInfografico}
          disabled={gerandoDownload}
        >
          {gerandoDownload ? '⏳ Gerando...' : '📥 Baixar Guia em Imagem'}
        </button>
      </section>

      {/* Grid de Visualização Web simulando fielmente o infográfico físico */}
      <div className="bg-danger p-3 rounded-3 shadow-lg" style={{ border: '4px solid #FFD166' }}>
        <div className="bg-dark p-3 rounded-2 row g-4">
          
          {/* Coluna Esquerda */}
          <div className="col-12 col-xl-6 d-flex flex-column gap-2">
            {colunaEsquerda.map((jogo) => (
              <div key={jogo.id} className="d-flex align-items-center bg-white text-dark rounded-1 overflow-hidden" style={{ minHeight: '46px' }}>
                <div className="bg-dark text-white p-2 text-center flex-shrink-0" style={{ minWidth: '100px', fontSize: '0.75rem', fontWeight: '800' }}>
                  <div className="text-white">{formatarDataAgenda(jogo.data)}</div>
                  <div className="text-warning">{jogo.horario} BRT</div>
                </div>
                <div className="px-3 fw-bold flex-grow-1 text-uppercase d-flex align-items-center justify-content-center gap-2" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                  <img 
                    src={`/${jogo.bandeiraA}`} 
                    alt="" 
                    style={{ width: '32px', height: '22px', objectFit: 'cover', borderRadius: '6px 2px 16px 6px', border: '1px solid rgba(0, 200, 83, 0.3)' }} 
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <span className="mx-1 text-center">{formatarNomeSelecao(jogo.selecaoA)} - {formatarNomeSelecao(jogo.selecaoB)}</span>
                  <img 
                    src={`/${jogo.bandeiraB}`} 
                    alt="" 
                    style={{ width: '32px', height: '22px', objectFit: 'cover', borderRadius: '2px 6px 6px 16px', border: '1px solid rgba(0, 200, 83, 0.3)' }} 
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <div className="px-3 text-muted small fw-bolder text-end flex-shrink-0" style={{ minWidth: '130px' }}>
                  📺 {obterCanaisTransmissao(jogo.grupo).join(' · ')}
                </div>
              </div>
            ))}
          </div>

          {/* Coluna Direita */}
          <div className="col-12 col-xl-6 d-flex flex-column gap-2">
            {colunaDireita.map((jogo) => (
              <div key={jogo.id} className="d-flex align-items-center bg-white text-dark rounded-1 overflow-hidden" style={{ minHeight: '46px' }}>
                <div className="bg-dark text-white p-2 text-center flex-shrink-0" style={{ minWidth: '100px', fontSize: '0.75rem', fontWeight: '800' }}>
                  <div className="text-white">{formatarDataAgenda(jogo.data)}</div>
                  <div className="text-warning">{jogo.horario} BRT</div>
                </div>
                <div className="px-3 fw-bold flex-grow-1 text-uppercase d-flex align-items-center justify-content-center gap-2" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                  <img 
                    src={`/${jogo.bandeiraA}`} 
                    alt="" 
                    style={{ width: '32px', height: '22px', objectFit: 'cover', borderRadius: '6px 2px 16px 6px', border: '1px solid rgba(0, 200, 83, 0.3)' }} 
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <span className="mx-1 text-center">{formatarNomeSelecao(jogo.selecaoA)} - {formatarNomeSelecao(jogo.selecaoB)}</span>
                  <img 
                    src={`/${jogo.bandeiraB}`} 
                    alt="" 
                    style={{ width: '32px', height: '22px', objectFit: 'cover', borderRadius: '2px 6px 6px 16px', border: '1px solid rgba(0, 200, 83, 0.3)' }} 
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <div className="px-3 text-muted small fw-bolder text-end flex-shrink-0" style={{ minWidth: '130px' }}>
                  📺 {obterCanaisTransmissao(jogo.grupo).join(' · ')}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Elemento Oculto do Canvas para processamento em background */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </main>
  );
}