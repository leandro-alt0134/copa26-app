import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { isNativePlatform } from './platformService';

/**
 * Aciona feedback háptico sutil (impacto leve).
 */
export async function vibrateLight() {
  if (isNativePlatform()) {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (err) {
      console.warn('Haptics falhou:', err);
    }
  }
}

/**
 * Aciona feedback háptico intermediário (impacto médio).
 */
export async function vibrateMedium() {
  if (isNativePlatform()) {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (err) {
      console.warn('Haptics falhou:', err);
    }
  }
}

/**
 * Aciona feedback de sucesso.
 */
export async function vibrateSuccess() {
  if (isNativePlatform()) {
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch (err) {
      console.warn('Haptics falhou:', err);
    }
  }
}

/**
 * Aciona feedback de aviso.
 */
export async function vibrateWarning() {
  if (isNativePlatform()) {
    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch (err) {
      console.warn('Haptics falhou:', err);
    }
  }
}

/**
 * Aciona feedback de erro.
 */
export async function vibrateError() {
  if (isNativePlatform()) {
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch (err) {
      console.warn('Haptics falhou:', err);
    }
  }
}
