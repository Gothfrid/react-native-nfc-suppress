import { useEffect, useState } from 'react';

import { isSupported } from '../NfcSuppressor';

export const useNfcSupportedState = () => {
  const [supported, setSupported] = useState<boolean>(false);

  useEffect(() => {
    isSupported().then((response) => {
      setSupported(Boolean(response));
    });
  }, []);

  return supported;
};
