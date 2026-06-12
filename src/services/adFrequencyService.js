import { prepareInterstitial, showInterstitial } from './adMobService';
import { isNativePlatform } from './platformService';

const KEY_ACTION_COUNT = 'copa2026_ad_action_count';
const KEY_LAST_SHOWN = 'copa2026_ad_last_shown_time';
const TIME_LIMIT_MS = 5 * 60 * 1000; // 5 minutos
const ACTION_THRESHOLD = 3; // mínimo de 3 ações

/**
 * Incrementa a quantidade de ações relevantes do usuário.
 */
export function recordRelevantAction() {
  if (!isNativePlatform()) return;

  try {
    const currentCount = parseInt(localStorage.getItem(KEY_ACTION_COUNT) || '0', 10);
    const newCount = currentCount + 1;
    localStorage.setItem(KEY_ACTION_COUNT, newCount.toString());
    
    if (import.meta.env.DEV) {
      console.log(`[Ad Frequency] Ação relevante registrada. Total acumulado: ${newCount}/${ACTION_THRESHOLD}`);
    }
  } catch (err) {
    console.warn('[Ad Frequency] Falha ao registrar ação relevante no LocalStorage:', err);
  }
}

/**
 * Retorna se as regras de limite de frequência permitem a exibição de um intersticial.
 */
export function canShowInterstitial() {
  if (!isNativePlatform()) return false;

  try {
    const currentCount = parseInt(localStorage.getItem(KEY_ACTION_COUNT) || '0', 10);
    const lastShown = parseInt(localStorage.getItem(KEY_LAST_SHOWN) || '0', 10);
    const now = Date.now();
    const elapsed = now - lastShown;

    const countOk = currentCount >= ACTION_THRESHOLD;
    const timeOk = elapsed >= TIME_LIMIT_MS;

    if (import.meta.env.DEV) {
      console.log(`[Ad Frequency Status] Contagem de ações: ${currentCount}/${ACTION_THRESHOLD} (${countOk ? 'OK' : 'Pendente'}). Tempo decorrido: ${Math.round(elapsed / 1000)}s/${TIME_LIMIT_MS / 1000}s (${timeOk ? 'OK' : 'Pendente'}).`);
    }

    return countOk && timeOk;
  } catch (err) {
    console.warn('[Ad Frequency] Erro ao verificar condições de exibição:', err);
    return false;
  }
}

/**
 * Reseta o contador de ações relevantes e atualiza o timestamp da última exibição.
 */
function resetFrequencyControl() {
  try {
    localStorage.setItem(KEY_ACTION_COUNT, '0');
    localStorage.setItem(KEY_LAST_SHOWN, Date.now().toString());
    if (import.meta.env.DEV) {
      console.log('[Ad Frequency] Contadores de publicidade resetados.');
    }
  } catch (err) {
    console.warn('[Ad Frequency] Erro ao redefinir contadores no LocalStorage:', err);
  }
}

/**
 * Tenta preparar e exibir um anúncio intersticial caso as restrições de frequência permitam.
 * @returns {Promise<boolean>} Retorna true se exibido com sucesso, ou false caso contrário.
 */
export async function triggerInterstitialWithFrequency() {
  if (!isNativePlatform()) return false;

  if (!canShowInterstitial()) {
    if (import.meta.env.DEV) {
      console.log('[Ad Frequency] Exibição de intersticial ignorada devido ao limite de frequência ou ações.');
    }
    return false;
  }

  if (import.meta.env.DEV) {
    console.log('[Ad Frequency] Iniciando carregamento de intersticial...');
  }

  // Prepara o anúncio intersticial
  const prepared = await prepareInterstitial();
  if (!prepared) {
    if (import.meta.env.DEV) {
      console.warn('[Ad Frequency] Abortando: Falha ao preparar intersticial.');
    }
    return false;
  }

  // Mostra o anúncio intersticial
  const shown = await showInterstitial();
  if (shown) {
    resetFrequencyControl();
    return true;
  }

  return false;
}
