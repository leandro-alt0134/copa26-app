import React, { useState, useEffect } from 'react';

/**
 * Banner de consentimento de privacidade premium (LGPD/GDPR) para Copa 2026 Simulator.
 * Renders on top of the layout until a decision is registered.
 */
export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consentStr = localStorage.getItem('copa2026_privacy_consent');
      if (!consentStr) {
        // Exibir banner após um pequeno delay para suavidade visual
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      } else {
        const consent = JSON.parse(consentStr);
        if (!consent.decisionMade) {
          setVisible(true);
        }
      }
    } catch (e) {
      setVisible(true);
    }
  }, []);

  const saveConsent = (adsEnabled, personalizedAds) => {
    try {
      const consentObj = {
        decisionMade: true,
        adsEnabled,
        personalizedAds
      };
      localStorage.setItem('copa2026_privacy_consent', JSON.stringify(consentObj));
      
      // Despacha evento customizado para notificar componentes de anúncio ativos
      window.dispatchEvent(new Event('copa2026_privacy_changed'));
      
      setVisible(false);
    } catch (err) {
      console.error('Falha ao salvar consentimento de privacidade:', err);
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      className="privacy-consent-banner animate-fade-in"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '92%',
        maxWidth: '700px',
        background: 'rgba(4, 62, 39, 0.94)',
        border: '1px solid rgba(0, 200, 83, 0.35)',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 9999,
        padding: '20px 24px',
        color: '#FFFFFF'
      }}
    >
      <div className="d-flex flex-column gap-3">
        {/* Cabeçalho do Banner */}
        <div className="d-flex align-items-start gap-2">
          <span style={{ fontSize: '1.4rem' }}>🛡️</span>
          <div>
            <h5 
              className="mb-1 text-white font-weight-bold" 
              style={{ fontSize: '0.98rem', letterSpacing: '0.5px' }}
            >
              Preferências de Privacidade e Cookies
            </h5>
            <p 
              className="mb-0 text-white-50" 
              style={{ fontSize: '0.78rem', lineHeight: '1.4' }}
            >
              Nós e parceiros terceiros (como Google) utilizamos cookies e identificadores de anúncios para personalizar anúncios e analisar tráfego de forma agregada. Seus palpites e simulações permanecem 100% locais no aparelho.
            </p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="d-flex flex-wrap justify-content-end gap-2 pt-1">
          {/* Opção 1: Recusar/Desativar tudo */}
          <button
            type="button"
            className="btn btn-outline-danger btn-sm px-3"
            onClick={() => saveConsent(false, false)}
            style={{ 
              fontSize: '0.76rem', 
              minHeight: '38px', 
              borderRadius: '10px',
              fontWeight: '600'
            }}
          >
            Recusar Anúncios
          </button>

          {/* Opção 2: Somente não-personalizados */}
          <button
            type="button"
            className="btn btn-outline-light btn-sm px-3"
            onClick={() => saveConsent(true, false)}
            style={{ 
              fontSize: '0.76rem', 
              minHeight: '38px', 
              borderRadius: '10px',
              fontWeight: '600',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            Apenas Necessários (Não-Personalizados)
          </button>

          {/* Opção 3: Aceitar Tudo */}
          <button
            type="button"
            className="btn btn-primary btn-sm px-4"
            onClick={() => saveConsent(true, true)}
            style={{ 
              fontSize: '0.76rem', 
              minHeight: '38px', 
              borderRadius: '10px',
              fontWeight: '700',
              background: 'var(--primary, #00C853)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0, 200, 83, 0.3)'
            }}
          >
            Aceitar Todos os Anúncios
          </button>
        </div>
      </div>
    </div>
  );
}
