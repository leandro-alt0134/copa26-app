import { Capacitor } from '@capacitor/core';

export const isNativePlatform = () => {
  return Capacitor.isNativePlatform();
};

export const getPlatform = () => {
  return Capacitor.getPlatform();
};

export const isAndroid = () => {
  return getPlatform() === 'android';
};

export const isIOS = () => {
  return getPlatform() === 'ios';
};

export const isWeb = () => {
  return getPlatform() === 'web' || !isNativePlatform();
};

export const isStandalone = () => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
};

export const isPWA = () => {
  return !isNativePlatform() && isStandalone();
};
