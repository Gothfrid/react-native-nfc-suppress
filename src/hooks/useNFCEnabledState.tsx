import { useEffect, useRef, useState } from 'react';
import type { EmitterSubscription } from 'react-native';

import { getNFCStateListener, isEnabled } from '../ReactNativeNFCSuppresion';

import { useNFCSupportedState } from './useNFCSupportedState';

export const useNFCEnabledState = () => {
  const supported = useNFCSupportedState();

  const [enabled, setEnabled] = useState<boolean>(false);
  const listener = useRef<EmitterSubscription>();

  useEffect(() => {
    if (supported) {
      isEnabled().then((response: boolean) => {
        setEnabled(response);
      });
      listener.current = getNFCStateListener(setEnabled);
    }
    return () => {
      if (listener.current) {
        listener.current.remove();
      }
    };
  }, [supported]);

  return enabled;
};
