import { useEffect, useRef, useState } from 'react';
import type { EmitterSubscription } from 'react-native';

import { getNfcStateListener, isNfcEnabled } from '../NfcSuppressor';

import { useNfcSupportedState } from './useNfcSupportedState';

export const useNfcEnabledState = () => {
  const supported = useNfcSupportedState();

  const [enabled, setEnabled] = useState<boolean>(false);
  const listener = useRef<EmitterSubscription>();

  useEffect(() => {
    if (supported) {
      isNfcEnabled().then((response) => {
        setEnabled(Boolean(response));
      });
      listener.current = getNfcStateListener(setEnabled);
    }
    return () => {
      if (listener.current) {
        listener.current.remove();
      }
    };
  }, [supported]);

  return enabled;
};
