import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { isNativePlatform, isAndroid } from './platformService';

let isInitialized = false;
let isBannerActive = false;

/**
 * Recupera a escolha de privacidade e consentimento do localStorage.
 */
export const getPrivacyConsent = () => {
  try {
    const val = localStorage.getItem('copa2026_privacy_consent');
    if (!val) {
      return { decisionMade: false, adsEnabled: false, personalizedAds: false };
    }
    return JSON.parse(val);
  } catch (e) {
    return { decisionMade: false, adsEnabled: false, personalizedAds: false };
  }
};

/**
 * Obtém o Ad Unit ID correto com base na plataforma e modo (desenvolvimento vs produção).
 */
const getAdUnitId = (type) => {
  const isDev = import.meta.env.DEV || import.meta.env.VITE_USE_TEST_ADS === 'true';
  const android = isAndroid();

  if (isDev) {
    if (import.meta.env.DEV) {
      console.log(`[AdMob Service] Utilizando ID de Teste do Google para: ${type}`);
    }
    if (type === 'banner') {
      return android ? 'ca-app-pub-3940256099942544/6300978111' : 'ca-app-pub-3940256099942544/2934735716';
    }
    if (type === 'interstitial') {
      return android ? 'ca-app-pub-3940256099942544/1033173712' : 'ca-app-pub-3940256099942544/4411468910';
    }
    if (type === 'rewarded') {
      return android ? 'ca-app-pub-3940256099942544/5224354917' : 'ca-app-pub-3940256099942544/1712485313';
    }
  } else {
    if (type === 'banner') {
      return import.meta.env.VITE_ADMOB_BANNER_ID;
    }
    if (type === 'interstitial') {
      return import.meta.env.VITE_ADMOB_INTERSTITIAL_ID;
    }
    if (type === 'rewarded') {
      return import.meta.env.VITE_ADMOB_REWARDED_ID;
    }
  }
  return '';
};

/**
 * Inicializa a SDK do AdMob.
 */
export async function initializeAdMob() {
  if (!isNativePlatform()) return false;
  if (isInitialized) return true;

  const enableAds = import.meta.env.VITE_ENABLE_ADS === 'true';
  if (!enableAds) {
    if (import.meta.env.DEV) {
      console.log('[AdMob Service] Inicialização abortada: VITE_ENABLE_ADS está definido como false.');
    }
    return false;
  }

  const consent = getPrivacyConsent();
  if (consent.decisionMade && !consent.adsEnabled) {
    if (import.meta.env.DEV) {
      console.log('[AdMob Service] Inicialização abortada: Usuário desativou anúncios nas preferências de privacidade.');
    }
    return false;
  }

  try {
    await AdMob.initialize({
      requestTrackingAuthorization: true, // Para iOS (ATT)
      initializeForTesting: import.meta.env.DEV || import.meta.env.VITE_USE_TEST_ADS === 'true',
    });
    isInitialized = true;
    if (import.meta.env.DEV) {
      console.log('[AdMob Service] SDK AdMob inicializada com sucesso.');
    }
    return true;
  } catch (err) {
    console.error('[AdMob Service] Falha ao inicializar SDK AdMob:', err);
    return false;
  }
}

/**
 * Exibe o banner nativo.
 */
export async function showBanner() {
  if (!isNativePlatform()) return;
  
  const ok = await initializeAdMob();
  if (!ok) return;

  const consent = getPrivacyConsent();
  if (consent.decisionMade && !consent.adsEnabled) return;

  if (isBannerActive) {
    if (import.meta.env.DEV) {
      console.log('[AdMob Service] Banner já está ativo e visível.');
    }
    return;
  }

  const adId = getAdUnitId('banner');
  if (!adId) {
    if (import.meta.env.DEV) {
      console.warn('[AdMob Service] Abortando showBanner: Ad Unit ID não configurado.');
    }
    return;
  }

  try {
    const isTest = import.meta.env.DEV || import.meta.env.VITE_USE_TEST_ADS === 'true';
    await AdMob.showBanner({
      adId: adId,
      adSize: BannerAdSize.BANNER,
      // Usar BOTTOM_CENTER de forma padrão para segurança visual
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 60, // Margem de 60px para ficar acima do MobileBottomNav de forma limpa
      isTesting: isTest,
      npa: !consent.personalizedAds // não-personalizado se consent.personalizedAds for falso
    });
    isBannerActive = true;
    if (import.meta.env.DEV) {
      console.log('[AdMob Service] Banner exibido com sucesso.');
    }
  } catch (err) {
    console.error('[AdMob Service] Falha ao exibir banner:', err);
  }
}

/**
 * Oculta temporariamente o banner (mantém em cache/memória).
 */
export async function hideBanner() {
  if (!isNativePlatform() || !isInitialized || !isBannerActive) return;

  try {
    await AdMob.hideBanner();
    if (import.meta.env.DEV) {
      console.log('[AdMob Service] Banner ocultado.');
    }
  } catch (err) {
    console.error('[AdMob Service] Falha ao ocultar banner:', err);
  }
}

/**
 * Remove e destrói o banner ativo.
 */
export async function removeBanner() {
  if (!isNativePlatform() || !isInitialized || !isBannerActive) return;

  try {
    await AdMob.removeBanner();
    isBannerActive = false;
    if (import.meta.env.DEV) {
      console.log('[AdMob Service] Banner removido e destruído.');
    }
  } catch (err) {
    console.error('[AdMob Service] Falha ao remover banner:', err);
  }
}

/**
 * Pré-carrega um anúncio intersticial na memória para carregamento instantâneo.
 */
export async function prepareInterstitial() {
  if (!isNativePlatform()) return false;

  const ok = await initializeAdMob();
  if (!ok) return false;

  const adId = getAdUnitId('interstitial');
  if (!adId) return false;

  try {
    const isTest = import.meta.env.DEV || import.meta.env.VITE_USE_TEST_ADS === 'true';
    await AdMob.prepareInterstitial({
      adId: adId,
      isTesting: isTest
    });
    if (import.meta.env.DEV) {
      console.log('[AdMob Service] Intersticial preparado com sucesso.');
    }
    return true;
  } catch (err) {
    console.error('[AdMob Service] Falha ao preparar intersticial:', err);
    return false;
  }
}

/**
 * Exibe o intersticial pré-carregado.
 */
export async function showInterstitial() {
  if (!isNativePlatform() || !isInitialized) return false;

  try {
    await AdMob.showInterstitial();
    if (import.meta.env.DEV) {
      console.log('[AdMob Service] Intersticial exibido.');
    }
    return true;
  } catch (err) {
    console.error('[AdMob Service] Falha ao exibir intersticial:', err);
    return false;
  }
}

/**
 * Pré-carrega um anúncio de vídeo recompensado.
 */
export async function prepareRewarded() {
  if (!isNativePlatform()) return false;

  const ok = await initializeAdMob();
  if (!ok) return false;

  const adId = getAdUnitId('rewarded');
  if (!adId) return false;

  try {
    const isTest = import.meta.env.DEV || import.meta.env.VITE_USE_TEST_ADS === 'true';
    await AdMob.prepareRewarded({
      adId: adId,
      isTesting: isTest
    });
    if (import.meta.env.DEV) {
      console.log('[AdMob Service] Vídeo recompensado preparado com sucesso.');
    }
    return true;
  } catch (err) {
    console.error('[AdMob Service] Falha ao preparar vídeo recompensado:', err);
    return false;
  }
}

/**
 * Exibe o anúncio de vídeo recompensado e executa callback de recompensa se concluído.
 * @param {Function} onRewardEarned - Callback executado quando a recompensa é concedida.
 */
export async function showRewarded(onRewardEarned) {
  if (!isNativePlatform() || !isInitialized) return false;

  try {
    const rewardItem = await AdMob.showRewarded();
    if (rewardItem && typeof onRewardEarned === 'function') {
      if (import.meta.env.DEV) {
        console.log(`[AdMob Service] Recompensa concedida: ${rewardItem.amount} ${rewardItem.type}`);
      }
      onRewardEarned(rewardItem);
    }
    return true;
  } catch (err) {
    console.error('[AdMob Service] Falha ao exibir recompensado:', err);
    return false;
  }
}
