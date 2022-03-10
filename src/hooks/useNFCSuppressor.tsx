import { useCallback, useEffect } from 'react';
import {
  enableSuppression,
  disableSuppression,
} from '../ReactNativeNFCSuppresion';

import { useNFCSupportedState } from './useNFCSupportedState';
import { useNFCEnabledState } from './useNFCEnabledState';
import { useNFCSuppressionState } from './useNFCSuppressionState';

export const useNFCSuppressor = () => {
  const supported = useNFCSupportedState();
  const enabled = useNFCEnabledState();
  const suppressed = useNFCSuppressionState();
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
