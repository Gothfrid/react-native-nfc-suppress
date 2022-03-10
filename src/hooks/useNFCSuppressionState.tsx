import { useEffect, useRef, useState } from 'react';
import type { EmitterSubscription } from 'react-native';

import {
  getSuppressionStateListener,
  isSuppressing,
} from '../ReactNativeNFCSuppresion';

import { useNFCSupportedState } from './useNFCSupportedState';

export const useNFCSuppressionState = () => {
  const supported = useNFCSupportedState();

  const [suppressed, setSuppressed] = useState<boolean>(false);
  const listener = useRef<EmitterSubscription>();

  useEffect(() => {
    if (supported) {
      isSuppressing().then((response: boolean) => {
        setSuppressed(response);
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
