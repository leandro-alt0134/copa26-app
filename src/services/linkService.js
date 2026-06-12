import { Browser } from '@capacitor/browser';
import { isNativePlatform } from './platformService';

/**
 * Abre um link externo de forma segura, utilizando o navegador in-app nativo se disponível.
 * @param {string} url - A URL a ser aberta.
 */
export async function abrirLinkExterno(url) {
  if (!url) return;

  if (isNativePlatform()) {
    try {
      await Browser.open({ url });
    } catch (err) {
      console.warn('Erro ao abrir link pelo Capacitor Browser:', err);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
