import React, { useState, useEffect } from 'react';

/**
 * Reusable Google AdSense Ad Block component for Copa 2026 PWA.
 * Fully responsive, offline-resilient, and optimized to prevent Cumulative Layout Shift (CLS).
 *
 * @param {Object} props
 * @param {string} props.slot - Google AdSense Ad Slot ID
 * @param {string} [props.format='auto'] - Ad format: 'auto', 'banner', 'rectangle', 'skyscraper'
 * @param {string} [props.responsive='true'] - Whether the ad block is responsive ('true' | 'false')
 */
export default function AdBlock({ slot, format = 'auto', responsive = 'true' }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [adFailed, setAdFailed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if the application is running inside a Trusted Web Activity (TWA) nativo para Google Play Store
  const [isPlayStore] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const hasTwaQuery = params.get('utm_source') === 'twa' || 
                         params.get('mode') === 'twa' || 
                         params.get('twa') === 'true';
      
      const hasTwaReferrer = document.referrer && document.referrer.startsWith('android-app://');
      
      // Persist status across internal page navigation using sessionStorage
      const wasTwaSession = sessionStorage.getItem('is_twa_session') === 'true';
      const detectedTwa = hasTwaQuery || hasTwaReferrer || wasTwaSession;

      if (detectedTwa && !wasTwaSession) {
        sessionStorage.setItem('is_twa_session', 'true');
      }
      return detectedTwa;
    } catch (e) {
      console.error("[AdBlock Detection] Error resolving TWA session status:", e);
      return false;
    }
  });

  // Monitor network status to satisfy offline-first PWA resilience
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check and resize listener to prevent Cumulative Layout Shift (CLS)
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Developer logging for TWA environment verification
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log(
        `[AdBlock Debug] Ambiente detectado: ${
          isPlayStore ? 'Play Store App (TWA) 📱' : 'Web Browser PWA 🌐'
        } — Monetização AdSense: ${isPlayStore ? 'BLOQUEADA/INATIVA 🛡️' : 'ATIVA ✅'}`
      );
    }
  }, [isPlayStore]);

  // Try pushing AdSense instance once online, skipping if running in native Play Store container
  useEffect(() => {
    if (!isOnline || isPlayStore) return;

    try {
      // Ensure Google AdSense script structure is initialized
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.warn("Google AdSense script push failed (adblocker or script not loaded):", err);
      setAdFailed(true);
    }
  }, [isOnline, isPlayStore, slot]);

  // If the PWA is offline or running inside the native Google Play Store wrapper, bypass rendering completely
  if (!isOnline || isPlayStore) {
    return null;
  }

  // Determine height and dimensions based on the format to prevent CLS
  let minHeight = '250px';
  let maxWidth = '100%';

  if (format === 'banner') {
    // Horizontal banner: 320x50 on mobile, 728x90 or similar on desktop
    minHeight = isMobile ? '50px' : '90px';
    maxWidth = '1000px';
  } else if (format === 'rectangle') {
    // Medium Rectangle: 300x250
    minHeight = '250px';
    maxWidth = '336px';
  } else if (format === 'skyscraper') {
    // Skyscraper: 160x600
    minHeight = '600px';
    maxWidth = '300px';
  } else {
    // Auto or other custom formats
    minHeight = '250px';
  }

  // Detect Dev environment (Vite standard flag)
  const isDev = import.meta.env.DEV;

  return (
    <div 
      className={`ad-container-outer ad-format-${format}`} 
      style={{
        width: '100%',
        maxWidth: maxWidth,
        margin: '1.5rem auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 10px',
        boxSizing: 'border-box',
      }}
    >
      {/* Muted label indicating "PUBLICIDADE" */}
      <span 
        style={{
          display: 'block',
          fontSize: '0.62rem',
          fontWeight: '800',
          letterSpacing: '2px',
          color: 'rgba(183, 201, 192, 0.4)',
          marginBottom: '0.4rem',
          textTransform: 'uppercase',
          textAlign: 'center',
          userSelect: 'none'
        }}
      >
        Publicidade
      </span>

      {/* Glassmorphic ad container wrapper */}
      <div 
        className="ad-container-inner"
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
          transition: 'border-color 0.3s ease, background-color 0.3s ease',
          boxSizing: 'border-box',
        }}
      >
        {isDev || adFailed ? (
          // Beautiful dark glassmorphism placeholder for development/adblocker mode
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem',
              color: 'rgba(183, 201, 192, 0.65)',
              textAlign: 'center',
              userSelect: 'none'
            }}
          >
            <div style={{ fontSize: '1.3rem', marginBottom: '4px' }}>🏟️</div>
            <div 
              style={{ 
                fontSize: '0.75rem', 
                fontWeight: '800', 
                color: 'var(--primary)',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}
            >
              {format === 'banner' ? 'Google AdSense: Banner' : 'Google AdSense: Bloco'}
            </div>
            <div style={{ fontSize: '0.65rem', opacity: 0.5, marginTop: '2px' }}>
              Slot: {slot || 'auto-slot'} • {isMobile ? 'Mobile' : 'Desktop'}
            </div>
          </div>
        ) : (
          // Active Google AdSense Tag
          <ins 
            className="adsbygoogle"
            style={{ 
              display: 'block', 
              width: '100%', 
              height: '100%',
              minHeight: minHeight 
            }}
            data-ad-client="ca-pub-3940256099942544" // Google AdSense test client ID
            data-ad-slot={slot || '1234567890'}
            data-ad-format={format}
            data-full-width-responsive={responsive}
          />
        )}
      </div>
    </div>
  );
}
