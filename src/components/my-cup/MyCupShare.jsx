import React, { useState } from 'react';
import { generateMyCupShareText, drawMyCupCardPNG } from '../../utils/myCupShare';
import { compartilharDados } from '../../services/shareService';
import { vibrateSuccess, vibrateError, vibrateLight } from '../../services/hapticsService';
import { isNativePlatform } from '../../services/platformService';

export default function MyCupShare({
  myCupData = {},
  selecoes = []
}) {
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const shareText = generateMyCupShareText(myCupData);

  const handleCopy = () => {
    vibrateLight();
    navigator.clipboard.writeText(shareText).then(() => {
      vibrateSuccess();
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDownloadTXT = () => {
    vibrateLight();
    const blob = new Blob([shareText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `minha-copa-2026-resumo.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    vibrateSuccess();
  };

  const handleShare = async () => {
    vibrateLight();
    // Em navegadores web convencionais sem suporte a Web Share API,
    // o compartilharDados cai no fallback do Clipboard.
    // Mas no WhatsApp Web ou Mobile Web, os usuários preferem o compartilhamento direto via link de WhatsApp.
    // Por isso, se for Web e não tiver suporte a navigator.share, abrimos o link do WhatsApp para melhor UX.
    if (!isNativePlatform() && !navigator.share) {
      const urlShare = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(urlShare, '_blank');
      vibrateSuccess();
      return;
    }

    const success = await compartilharDados({
      title: 'Minha Projeção da Copa 2026 🏆',
      text: shareText
    });
    if (success) {
      vibrateSuccess();
    }
  };

  const handleDownloadCard = (layout = 'square') => {
    vibrateLight();
    setGenerating(true);

    const canvas = document.createElement('canvas');
    const isStories = layout === 'stories';
    canvas.width = isStories ? 1080 : 800;
    canvas.height = isStories ? 1920 : 800;
    const ctx = canvas.getContext('2d');

    // Draw card on canvas
    try {
      drawMyCupCardPNG(ctx, myCupData, selecoes, layout);
      const url = canvas.toDataURL('image/png');
      
      const link = document.createElement("a");
      link.setAttribute("href", url);
      const slugName = (n) => n ? n.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'copa';
      link.setAttribute("download", `minha-copa-campeao-${slugName(myCupData.champion)}-${layout}.png`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      vibrateSuccess();
    } catch (err) {
      console.error("Erro ao gerar card PNG da Minha Copa:", err);
      vibrateError();
      alert("Houve um erro ao renderizar o card de imagem no seu navegador. Você ainda pode compartilhar o texto do resumo!");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <article className="card match-picker-card p-4 h-100">
      <h3 className="h5 text-white mb-3 border-bottom border-light-subtle pb-2">
        📢 Compartilhe Sua Projeção
      </h3>
      <p className="small text-muted-old mb-4">
        Mostre para seus amigos quem será o campeão e qual o perfil da sua Copa!
      </p>

      <div className="d-flex flex-column gap-3">
        {/* Share Button */}
        <button
          onClick={handleShare}
          className="btn btn-whatsapp-share btn-lg py-3 w-100 text-white border-0"
        >
          <span>{isNativePlatform() ? '📤' : '💬'}</span> {isNativePlatform() ? 'Compartilhar Projeção' : 'Compartilhar no WhatsApp'}
        </button>

        {/* Copy and TXT Download Buttons */}
        <div className="row g-2">
          <div className="col-6">
            <button
              onClick={handleCopy}
              className="btn btn-share-secondary py-3 w-100 font-weight-bold"
              style={{ minHeight: '48px', fontSize: '0.88rem' }}
            >
              {copied ? '✅ Copiado!' : '📋 Copiar Resumo'}
            </button>
          </div>
          <div className="col-6">
            <button
              onClick={handleDownloadTXT}
              className="btn btn-share-secondary py-3 w-100 font-weight-bold"
              style={{ minHeight: '48px', fontSize: '0.88rem' }}
            >
              {copied ? 'TXT Baixado' : '📥 Baixar TXT'}
            </button>
          </div>
        </div>

        {/* Card Generation (Canvas Images) */}
        <div className="border-top border-light-subtle pt-3 mt-2">
          <label className="small text-muted-old font-weight-bold uppercase mb-2 d-block">
            Gerar Cards de Imagem PNG:
          </label>
          <div className="row g-2">
            <div className="col-6">
              <button
                onClick={() => handleDownloadCard('square')}
                className="btn btn-outline-light w-100 py-3"
                disabled={generating}
                style={{ fontSize: '0.82rem', fontWeight: 700 }}
              >
                🖼️ Card Quadrado
              </button>
            </div>
            <div className="col-6">
              <button
                onClick={() => handleDownloadCard('stories')}
                className="btn btn-outline-light w-100 py-3"
                disabled={generating}
                style={{ fontSize: '0.82rem', fontWeight: 700 }}
              >
                📱 Card Stories (Vertical)
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

