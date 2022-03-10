import { useEffect, useState } from 'react';

import { isSupported } from '../ReactNativeNFCSuppresion';

export const useNFCSupportedState = () => {
  const [supported, setSupported] = useState<boolean>(false);

  useEffect(() => {
    isSupported().then((response: boolean) => {
      setSupported(response);
    });
  }, []);

  return supported;
};
