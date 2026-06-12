import React, { useEffect, useState } from 'react';
import { isNativePlatform } from '../services/platformService';

export default function InstallPwaButton() {
  const [promptEvent, setPromptEvent] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  // Detecção de iOS e Standalone
  const isIOS = () => {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    );
  };

  const isStandalone = () => {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setPromptEvent(event);
    };

    const handleAppInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (promptEvent) {
      promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === 'accepted') {
        setInstalled(true);
        setPromptEvent(null);
      }
    } else if (isIOS() && !isStandalone()) {
      setShowIosInstructions(true);
    }
  };

  const handleCloseInstructions = () => {
    setShowIosInstructions(false);
  };

  // Se o app já estiver instalado, em modo standalone ou na plataforma nativa, oculta o botão
  if (isNativePlatform() || installed || isStandalone()) return null;

  // O botão fica visível apenas se houver o prompt de instalação disponível OU se for iOS e não standalone
  const isInstallable = !!promptEvent || (isIOS() && !isStandalone());

  if (!isInstallable) return null;

  return (
    <>
      <button 
        type="button" 
        className="btn-install-pwa" 
        onClick={handleInstallClick}
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      >
        📲 Instalar app
      </button>

      {/* Modal de Instruções para iOS (Safari) */}
      {showIosInstructions && (
        <div className="escudo-modal is-open" style={{ display: 'flex', zIndex: 2000 }}>
          <div className="escudo-modal__backdrop" onClick={handleCloseInstructions}></div>
          <article className="escudo-modal__content p-4 text-center text-white" style={{ maxWidth: '420px', minHeight: 'auto' }}>
            <button 
              type="button" 
              className="escudo-modal__close" 
              onClick={handleCloseInstructions}
              aria-label="Fechar modal"
            >
              &times;
            </button>
            <div className="mb-3 mt-2">
              <span className="hero-badge">🍏 Instalação no iOS</span>
            </div>
            <h3 className="h5 font-weight-bold text-white mb-3">Adicionar à Tela de Início</h3>
            <p className="small text-muted-old mb-4" style={{ lineHeight: '1.5' }}>
              Siga os passos abaixo para instalar o <strong>Palpitaria da Copa 2026</strong> no seu iPhone ou iPad usando o navegador Safari:
            </p>
            
            <div className="text-start mx-auto mb-4" style={{ maxWidth: '340px' }}>
              <div className="d-flex align-items-start gap-2 mb-3">
                <span className="badge bg-success text-white rounded-pill px-2 py-1" style={{ fontSize: '0.75rem' }}>1</span>
                <p className="small mb-0 text-white-50">
                  Toque no ícone de <strong>Compartilhar</strong> <span style={{ fontSize: '1.1rem' }}>⎋</span> na barra inferior do Safari.
                </p>
              </div>
              <div className="d-flex align-items-start gap-2 mb-3">
                <span className="badge bg-success text-white rounded-pill px-2 py-1" style={{ fontSize: '0.75rem' }}>2</span>
                <p className="small mb-0 text-white-50">
                  Role a lista de opções e toque em <strong>Adicionar à Tela de Início</strong> <span style={{ fontSize: '1.1rem' }}>➕</span>.
                </p>
              </div>
              <div className="d-flex align-items-start gap-2">
                <span className="badge bg-success text-white rounded-pill px-2 py-1" style={{ fontSize: '0.75rem' }}>3</span>
                <p className="small mb-0 text-white-50">
                  Confirme tocando em <strong>Adicionar</strong> no canto superior direito. Pronto!
                </p>
              </div>
            </div>

            <button 
              type="button" 
              className="btn btn-primary w-100 py-2" 
              onClick={handleCloseInstructions}
              style={{ borderRadius: '12px', fontWeight: 'bold' }}
            >
              Entendi
            </button>
          </article>
        </div>
      )}
    </>
  );
}
