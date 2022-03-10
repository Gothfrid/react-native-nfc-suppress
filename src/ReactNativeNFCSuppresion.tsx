import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

import { NfcSuppress } from './NfcSuppress';

import type { ConfigProps } from './types';

import { isFeatureSupported } from './utils';

export async function isSupported(config?: ConfigProps): Promise<boolean> {
  const { debug = false } = config || {};
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

export async function isEnabled(config?: ConfigProps): Promise<boolean> {
  const { debug = false } = config || {};
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

export async function isSuppressing(config?: ConfigProps): Promise<boolean> {
  const { debug = false } = config || {};
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

export async function openNFCSettings(config?: ConfigProps): Promise<void> {
  const { debug = false } = config || {};
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

export async function enableSuppression(config?: ConfigProps): Promise<void> {
  const { debug = false } = config || {};
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

export async function disableSuppression(config?: ConfigProps): Promise<void> {
  const { debug = false } = config || {};
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

export function getEventEmitter(
  config?: ConfigProps
): NativeEventEmitter | undefined {
  const { debug = false } = config || {};
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

export function getSuppressionStateListener(
  callback: (state: boolean) => void,
  config?: ConfigProps
): EmitterSubscription | undefined {
  const { debug = false } = config || {};
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

export function getNFCStateListener(
  callback: (state: boolean) => void,
  config?: ConfigProps
): EmitterSubscription | undefined {
  const { debug = false } = config || {};
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
