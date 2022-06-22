import { useCallback, useEffect } from 'react';
import { enableSuppression, disableSuppression } from '../NfcSuppressor';

import { useNfcSupportedState } from './useNfcSupportedState';
import { useNfcEnabledState } from './useNfcEnabledState';
import { useNfcSuppressionState } from './useNfcSuppressionState';

export const useNfcSuppressor = () => {
  const supported = useNfcSupportedState();
  const enabled = useNfcEnabledState();
  const suppressed = useNfcSuppressionState();
  const enable = useCallback(() => {
    if (supported) {
      enableSuppression();
    }
  }, [supported]);

  const disable = useCallback(() => {
    if (supported) {
      disableSuppression();
    }
  }, [supported]);

  useEffect(() => {
    return () => {
      disable();
    };
  }, [disable]);

  return {
    suppressed,
    supported,
    enabled,
    enable,
    disable,
  };
};
