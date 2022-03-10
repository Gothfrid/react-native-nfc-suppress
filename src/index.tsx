import { useEffect, useRef, useState } from 'react';
import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';

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

export async function isSupported(): Promise<boolean> {
  let supported: boolean = false;
  try {
    if (Platform.OS === 'android') {
      supported = await NfcSuppress.isNFCSupported();
    }
  } catch (error) {
    console.error('Failed to check, if NFC is supported', error);
  } finally {
    return supported;
  }
}

export async function isEnabled(): Promise<boolean> {
  let enabled: boolean = false;
  try {
    enabled = await NfcSuppress.isNFCEnabled();
  } catch (error) {
    console.error('Failed to get NFC State.', error);
  } finally {
    return enabled;
  }
}

export async function isSuppressing(): Promise<boolean> {
  let suppressing: boolean = false;
  try {
    suppressing = await NfcSuppress.isNFCSuppressionEnabled();
  } catch (error) {
    console.error('Failed to get NFC Suppression state.');
  } finally {
    return suppressing;
  }
}

export async function openNFCSettings(): Promise<void> {
  try {
    await NfcSuppress.openNFCSettings();
  } catch (error) {
    console.error('Failed to open NFC Settings.');
  }
}

export async function enableSuppression(): Promise<void> {
  try {
    await NfcSuppress.enableSuppression();
  } catch (error) {
    console.error('Failed to enable NFC suppression.');
  }
  return;
}

export async function disableSuppression(): Promise<void> {
  try {
    await NfcSuppress.disableSuppression();
  } catch (error) {
    console.error('Failed to disable NFC suppression.');
  }
  return;
}

export const useNFCSuppressor = () => {
  const [suppressed, setSuppressed] = useState<boolean>(false);
  const [supported, setSupported] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);

  const suppressionListenerRef = useRef<EmitterSubscription>();
  const nfcEnabledListenerRef = useRef<EmitterSubscription>();

  useEffect(() => {
    isSupported().then((response: boolean) => {
      setSupported(response);
    });
  }, []);

  useEffect(() => {
    if (supported) {
      const eventEmitter = new NativeEventEmitter(NativeModules.NfcSuppress);
      suppressionListenerRef.current = eventEmitter.addListener(
        'suppress_state_changed',
        (event: boolean): void => {
          setSuppressed(event);
        }
      );
    }

    return () => {
      if (suppressionListenerRef.current) {
        suppressionListenerRef.current.remove();
      }
    };
  }, [supported]);

  useEffect(() => {
    if (supported) {
      isEnabled().then((response) => {
        setEnabled(response);
      });
      const eventEmitter = new NativeEventEmitter(NativeModules.NfcSuppress);
      nfcEnabledListenerRef.current = eventEmitter.addListener(
        'nfc_state_changed',
        (event: boolean): void => {
          setEnabled(event);
        }
      );
    }
    return () => {
      if (nfcEnabledListenerRef.current) {
        nfcEnabledListenerRef.current.remove();
      }
    };
  }, [supported]);

  useEffect(() => {
    return () => {
      if (supported) {
        disableSuppression();
      }
    };
  }, [supported]);

  return {
    suppressed,
    supported,
    enabled,
    enableSuppression,
    disableSuppression,
  };
};
