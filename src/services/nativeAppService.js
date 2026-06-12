import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { isNativePlatform } from './platformService';

/**
 * Configura as preferências do app nativo no ciclo de inicialização.
 */
export async function inicializarAppNativo() {
  if (!isNativePlatform()) return;

  try {
    // Configura a status bar para combinar com o tema escuro oficial do app (#061A12)
    await StatusBar.setBackgroundColor({ color: '#061A12' });
    await StatusBar.setStyle({ style: Style.Dark });
  } catch (err) {
    console.warn('Erro ao configurar StatusBar nativa:', err);
  }

  try {
    // Oculta a splash screen nativa após a renderização inicial do app React
    await SplashScreen.hide();
  } catch (err) {
    console.warn('Erro ao ocultar SplashScreen nativa:', err);
  }
}
