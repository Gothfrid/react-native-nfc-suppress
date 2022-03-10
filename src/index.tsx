import { useCallback, useEffect, useRef, useState } from 'react';
import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
  Platform,
  PlatformOSType,
} from 'react-native';
import type { BaseProps, StateListenerProps } from './types';

const LINKING_ERROR =
  `The package 'react-native-nfc-suppress' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const NfcSuppress = NativeModules.NfcSuppress
  ? NativeModules.NfcSuppress
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

function isFeatureSupported(targets: PlatformOSType[]): boolean {
  let result = false;
  if (targets.includes(Platform.OS)) {
    result = true;
  }
  return result;
}

export async function isSupported({
  debug = true,
}: BaseProps): Promise<boolean> {
  let supported: boolean = false;
  try {
    if (isFeatureSupported(['android'])) {
      supported = await NfcSuppress.isNFCSupported();
    } else {
      throw Error('Unsupported');
    }
  } catch (error) {
    if (debug) {
      console.error('Failed to check device NFC support: ', error);
    }
  } finally {
    return supported;
  }
}

export async function isEnabled({ debug = true }: BaseProps): Promise<boolean> {
  let enabled: boolean = false;
  try {
    if (isFeatureSupported(['android'])) {
      enabled = await NfcSuppress.isNFCEnabled();
    } else {
      throw Error('Unsupported');
    }
  } catch (error) {
    if (debug) {
      console.error('Failed to get device NFC state: ', error);
    }
  } finally {
    return enabled;
  }
}

export async function isSuppressing({
  debug = true,
}: BaseProps): Promise<boolean> {
  let suppressing: boolean = false;
  try {
    if (isFeatureSupported(['android'])) {
      suppressing = await NfcSuppress.isNFCSuppressionEnabled();
    } else {
      throw Error('Unsupported');
    }
  } catch (error) {
    if (debug) {
      console.error('Failed to get device NFC suppression state: ', error);
    }
  } finally {
    return suppressing;
  }
}

export async function openNFCSettings({
  debug = true,
}: BaseProps): Promise<void> {
  try {
    if (isFeatureSupported(['android'])) {
      await NfcSuppress.openNFCSettings();
    } else {
      throw Error('Unsupported');
    }
  } catch (error) {
    if (debug) {
      console.error('Failed to open NFC Settings: ', error);
    }
  } finally {
    return;
  }
}

export async function enableSuppression({
  debug = true,
}: BaseProps): Promise<void> {
  try {
    if (isFeatureSupported(['android'])) {
      await NfcSuppress.enableSuppression();
    } else {
      throw Error('Unsupported');
    }
  } catch (error) {
    if (debug) {
      console.error('Failed to enable NFC suppression: ', error);
    }
  } finally {
    return;
  }
}

export async function disableSuppression({
  debug = true,
}: BaseProps): Promise<void> {
  try {
    if (isFeatureSupported(['android'])) {
      await NfcSuppress.disableSuppression();
    } else {
      throw Error('Unsupported');
    }
  } catch (error) {
    if (debug) {
      console.error('Failed to disable NFC suppression: ', error);
    }
  } finally {
    return;
  }
}

export function getEventEmitter({
  debug = true,
}: BaseProps): NativeEventEmitter | undefined {
  let eventEmitter;
  try {
    if (isFeatureSupported(['android'])) {
      eventEmitter = new NativeEventEmitter(NativeModules.NfcSuppress);
    } else {
      throw Error('Unsupported');
    }
  } catch (error) {
    if (debug) {
      console.error('Failed to get event emitter: ', error);
    }
  } finally {
    return eventEmitter;
  }
}

export function getSuppressionStateListener({
  callback,
  debug = true,
}: StateListenerProps): EmitterSubscription | undefined {
  let subscription;
  try {
    const emitter = getEventEmitter({ debug });
    if (emitter) {
      subscription = emitter.addListener(
        'suppress_state_changed',
        (event: boolean): void => {
          callback(event);
        }
      );
    }
  } catch (error) {
    if (debug) {
      console.error(
        'Failed to subscribe on suppression state changes: ',
        error
      );
    }
  } finally {
    return subscription;
  }
}

export function getNFCStateListener({
  callback,
  debug = true,
}: StateListenerProps): EmitterSubscription | undefined {
  let subscription;
  try {
    const emitter = getEventEmitter({ debug });
    if (emitter) {
      subscription = emitter.addListener(
        'nfc_state_changed',
        (event: boolean): void => {
          callback(event);
        }
      );
    }
  } catch (error) {
    if (debug) {
      console.error('Failed to subscribe on NFC state changes: ', error);
    }
  } finally {
    return subscription;
  }
}

export const useNFCSuppressor = ({ debug = true }: BaseProps) => {
  const [suppressed, setSuppressed] = useState<boolean>(false);
  const [supported, setSupported] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);

  const suppressionListenerRef = useRef<EmitterSubscription>();
  const nfcStateListenerRef = useRef<EmitterSubscription>();

  const enable = useCallback(() => {
    if (supported) {
      enableSuppression({ debug });
    }
  }, [supported, debug]);

  const disable = useCallback(() => {
    if (supported) {
      disableSuppression({ debug });
    }
  }, [supported, debug]);

  useEffect(() => {
    isSupported({ debug }).then((response: boolean) => {
      setSupported(response);
    });
  }, [debug]);

  useEffect(() => {
    if (supported) {
      suppressionListenerRef.current = getSuppressionStateListener({
        debug,
        callback: setSuppressed,
      });
    }
    return () => {
      if (suppressionListenerRef.current) {
        suppressionListenerRef.current.remove();
      }
    };
  }, [supported, debug]);

  useEffect(() => {
    if (supported) {
      isEnabled({ debug }).then((response) => {
        setEnabled(response);
      });
      nfcStateListenerRef.current = getNFCStateListener({
        debug,
        callback: setEnabled,
      });
    }
    return () => {
      if (nfcStateListenerRef.current) {
        nfcStateListenerRef.current.remove();
      }
    };
  }, [supported, debug]);

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
