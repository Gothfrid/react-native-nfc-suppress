import { useEffect, useRef, useState } from 'react';
import type { EmitterSubscription } from 'react-native';

import {
  getSuppressionStateListener,
  isSuppressionEnabled,
} from '../NfcSuppressor';

import { useNfcSupportedState } from './useNfcSupportedState';

export const useNfcSuppressionState = () => {
  const supported = useNfcSupportedState();

  const [suppressed, setSuppressed] = useState<boolean>(false);
  const listener = useRef<EmitterSubscription | undefined>();

  useEffect(() => {
    if (supported) {
      isSuppressionEnabled().then((response) => {
        setSuppressed(Boolean(response));
      });
      listener.current = getSuppressionStateListener(setSuppressed);
    }
    return () => {
      if (listener.current) {
        listener.current.remove();
      }
    };
  }, [supported]);

  return suppressed;
};
