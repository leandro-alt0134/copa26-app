import { Share } from '@capacitor/share';
import { isNativePlatform } from './platformService';

/**
 * Compartilha um conteúdo de texto ou link de forma unificada.
 * @param {Object} options - Objeto contendo { title, text, url }
 * @returns {Promise<boolean>} Retorna true se compartilhado com sucesso ou copiado.
 */
export async function compartilharDados({ title, text, url }) {
  const shareData = {
    title: title || 'Palpitaria Copa 2026',
    text: text || '',
    url: url || undefined,
  };

  if (isNativePlatform()) {
    try {
      const canShare = await Share.canShare();
      if (canShare.value) {
        await Share.share(shareData);
        return true;
      }
    } catch (err) {
      console.warn('Falha ao acionar Capacitor Share:', err);
      // Se o usuário cancelar ou ocorrer erro, prossegue para o fallback de cópia
    }
  }

  // Fallback 1: Web Share API (Safari, mobile browsers)
  if (!isNativePlatform() && navigator.share) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('Erro ao acionar navigator.share:', err);
      } else {
        return false; // Usuário cancelou
      }
    }
  }

  // Fallback 2: Área de transferência (Clipboard)
  try {
    const linkStr = shareData.url ? `\n🔗 ${shareData.url}` : '';
    const contentToCopy = `${shareData.title}\n${shareData.text}${linkStr}`;
    await navigator.clipboard.writeText(contentToCopy);
    alert('Informações copiadas para a área de transferência! 📋');
    return true;
  } catch (err) {
    console.error('Falha ao copiar para a área de transferência:', err);
    return false;
  }
}
