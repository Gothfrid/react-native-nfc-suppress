export { useNFCSupportedState } from './hooks/useNFCSupportedState';
export { useNFCEnabledState } from './hooks/useNFCEnabledState';
export { useNFCSuppressionState } from './hooks/useNFCSuppressionState';
export { useNFCSuppressor } from './hooks/useNFCSuppressor';

export {
  isSupported,
  isEnabled,
  isSuppressing,
  enableSuppression,
  disableSuppression,
  openNFCSettings,
  getEventEmitter,
  getNFCStateListener,
  getSuppressionStateListener,
} from './ReactNativeNFCSuppresion';

export type { ConfigProps } from './types';
