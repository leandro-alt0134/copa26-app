import React, { useState, useEffect } from 'react';
import { isNativePlatform } from '../../services/platformService';
import { showBanner, hideBanner, getPrivacyConsent } from '../../services/adMobService';
import WebAdSense from './WebAdSense';

/**
 * Componente unificado para posicionamento de publicidade.
 * Decide dinamicamente se renderiza o AdSense (Web) ou aciona o AdMob nativo.
 * 
 * @param {Object} props
 * @param {string} props.placement - Identificador do posicionamento (ex: 'matches-top')
 * @param {string} [props.format='banner'] - Formato do anúncio ('banner' | 'rectangle')
 */
export default function AdPlacement({ placement, format = 'banner' }) {
  const [consent, setConsent] = useState(() => getPrivacyConsent());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Monitorar alterações de consentimento (evento customizado)
    const handleConsentChange = () => {
      setConsent(getPrivacyConsent());
    };
    window.addEventListener('copa2026_privacy_changed', handleConsentChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('copa2026_privacy_changed', handleConsentChange);
    };
  }, []);

  const enableAds = import.meta.env.VITE_ENABLE_ADS === 'true';
  const showAd = enableAds && isOnline && (!consent.decisionMade || consent.adsEnabled);

  // Ciclo de vida nativo: exibe o banner quando o componente de posicionamento monta
  useEffect(() => {
    if (!isNativePlatform() || !showAd || format !== 'banner') return;

    // Exibe banner nativo
    showBanner();

    // Oculta/remove ao desmontar o posicionador
    return () => {
      hideBanner();
    };
  }, [showAd, format]);

  // Se anúncios estiverem desativados, offline ou recusados pelo usuário, não renderiza nada
  if (!showAd) {
    return null;
  }

  // Mapear placements para slots específicos definidos nas variáveis de ambiente
  let slotId = import.meta.env.VITE_ADSENSE_SLOT_RESPONSIVE || '1234567890';
  if (format === 'banner') {
    slotId = import.meta.env.VITE_ADSENSE_SLOT_BANNER || '1234567890';
  }

  if (isNativePlatform()) {
    // Para Capacitor Nativo, o AdMob é desenhado por cima em nível nativo.
    // Retornamos nulo no DOM para não ocupar espaço redundante no HTML.
    return null;
  }

  // Web e PWA utilizam AdSense inline no HTML
  return (
    <WebAdSense
      slot={`${placement}-${slotId}`}
      format={format}
      personalized={consent.personalizedAds}
    />
  );
}
