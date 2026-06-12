import React, { useState, useEffect } from 'react';
import { isWeb } from '../../services/platformService';

/**
 * Componente exclusivo de exibição do Google AdSense para ambiente Web e PWA.
 * 
 * @param {Object} props
 * @param {string} props.slot - Identificador do slot do anúncio.
 * @param {string} [props.format='auto'] - Formato do anúncio ('auto', 'banner', 'rectangle', 'skyscraper').
 * @param {string} [props.responsive='true'] - Se o bloco deve ser responsivo ('true' | 'false').
 * @param {boolean} [props.personalized=true] - Define se o anúncio será personalizado.
 */
export default function WebAdSense({ slot, format = 'auto', responsive = 'true', personalized = true }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [adFailed, setAdFailed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-3940256099942544'; // ID de teste como fallback
  const isDev = import.meta.env.DEV || import.meta.env.VITE_USE_TEST_ADS === 'true';

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Injetar script do AdSense apenas uma vez no Head do documento
  useEffect(() => {
    if (!isWeb() || !isOnline) return;

    let script = document.querySelector('script[src*="pagead2.googlesyndication.com"]');
    if (!script) {
      script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }, [isOnline, clientId]);

  // Executa o push do anúncio
  useEffect(() => {
    if (!isWeb() || !isOnline || isDev) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.warn('[WebAdSense] O script do AdSense falhou ao registrar (possível adblocker):', err);
      setAdFailed(true);
    }
  }, [isOnline, slot, isDev]);

  // Se estiver offline ou não for plataforma web, não renderiza nada
  if (!isWeb() || !isOnline) {
    return null;
  }

  // Definir dimensões estáticas para evitar Cumulative Layout Shift (CLS)
  let minHeight = '250px';
  let maxWidth = '100%';

  if (format === 'banner') {
    minHeight = isMobile ? '50px' : '90px';
    maxWidth = '1000px';
  } else if (format === 'rectangle') {
    minHeight = '250px';
    maxWidth = '336px';
  } else if (format === 'skyscraper') {
    minHeight = '600px';
    maxWidth = '160px';
  }

  return (
    <div
      className={`adsense-wrapper adsense-format-${format} text-center`}
      style={{
        width: '100%',
        maxWidth: maxWidth,
        margin: '1rem auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 10px',
        boxSizing: 'border-box'
      }}
    >
      <span
        style={{
          display: 'block',
          fontSize: '0.62rem',
          fontWeight: '800',
          letterSpacing: '2px',
          color: 'rgba(183, 201, 192, 0.4)',
          marginBottom: '0.4rem',
          textTransform: 'uppercase',
          userSelect: 'none'
        }}
      >
        Publicidade
      </span>

      <div
        className="adsense-container"
        style={{
          width: '100%',
          minHeight: minHeight,
          background: 'rgba(4, 62, 39, 0.15)',
          border: '1px dashed rgba(0, 200, 83, 0.18)',
          borderRadius: '16px',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          transition: 'border-color 0.3s ease',
          boxSizing: 'border-box'
        }}
      >
        {isDev || adFailed ? (
          // Placeholder bonito para modo de desenvolvimento ou adblocker ativo
          <div
            style={{
              padding: '1rem',
              color: 'rgba(183, 201, 192, 0.65)',
              userSelect: 'none'
            }}
          >
            <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>🏟️</div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: '800',
                color: 'var(--primary, #00C853)',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}
            >
              AdSense • {format === 'banner' ? 'Banner' : 'Bloco'}
            </div>
            <div style={{ fontSize: '0.62rem', opacity: 0.5, marginTop: '2px' }}>
              Slot: {slot} • {isMobile ? 'Mobile' : 'Desktop'} {!personalized && '• Não Personalizado'}
            </div>
          </div>
        ) : (
          // Inserção real do AdSense
          <ins
            className="adsbygoogle"
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              minHeight: minHeight
            }}
            data-ad-client={clientId}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive={responsive}
            // Adicionar flag de anúncio não-personalizado caso o consentimento do usuário seja restrito
            data-request-non-personalized-ads={!personalized ? '1' : undefined}
          />
        )}
      </div>
    </div>
  );
}
