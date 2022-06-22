import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

import { NfcSuppress } from './NfcSuppress';

import type { IErrorsMode, ITypedError } from './types';
import {
  logError,
  NFC_STATE_CHANGED,
  SUPPRESSION_STATE_CHANGED,
  throwError,
} from './utils';

export async function isSupported(
  errorMode: IErrorsMode = 'silent'
): Promise<boolean | void> {
  let supported;
  try {
    supported = await NfcSuppress.isNfcSupported();
  } catch (error) {
    if (errorMode === 'exception') {
      throwError('Failed to check device NFC support', error as ITypedError);
    } else if (errorMode === 'console') {
      logError('Failed to check device NFC support', error as ITypedError);
    }
  }

  return supported;
}

export async function isPermissionDeclared(
  errorMode: IErrorsMode = 'silent'
): Promise<boolean | void> {
  let hasPermissionDeclaration;
  try {
    hasPermissionDeclaration = await NfcSuppress.isPermissionDeclared();
  } catch (error) {
    if (errorMode === 'exception') {
      throwError('Failed to check declaration', error as ITypedError);
    } else if (errorMode === 'console') {
      logError('Failed to check declaration', error as ITypedError);
    }
  }
  return hasPermissionDeclaration;
}

export async function isNfcEnabled(
  errorMode: IErrorsMode = 'silent'
): Promise<boolean | void> {
  let enabled;
  try {
    enabled = await NfcSuppress.isNfcEnabled();
  } catch (error) {
    if (errorMode === 'exception') {
      throwError('Failed to check device NFC state', error as ITypedError);
    } else if (errorMode === 'console') {
      logError('Failed to check device NFC state', error as ITypedError);
    }
  }
  return enabled;
}

export async function isSuppressionEnabled(
  errorMode: IErrorsMode = 'silent'
): Promise<boolean | void> {
  let enabled;
  try {
    enabled = await NfcSuppress.isNFCSuppressionEnabled();
  } catch (error) {
    if (errorMode === 'exception') {
      throwError('Failed to check NFC suppression state', error as ITypedError);
    } else {
      enabled = false;
      if (errorMode === 'console') {
        logError('Failed to check NFC suppression state', error as ITypedError);
      }
    }
  }
  return enabled;
}

export async function openNfcSettings(
  errorMode: IErrorsMode = 'silent'
): Promise<void> {
  try {
    await NfcSuppress.openNfcSettings();
  } catch (error) {
    if (errorMode === 'console') {
      logError('Failed to open NFC Settings', error as ITypedError);
    } else if (errorMode === 'exception') {
      throwError('Failed to open NFC Settings', error as ITypedError);
    }
  }
}

export async function enableSuppression(
  errorMode: IErrorsMode = 'silent'
): Promise<void> {
  try {
    await NfcSuppress.enableSuppression();
  } catch (error) {
    if (errorMode === 'console') {
      logError('Failed to enable NFC suppression', error as ITypedError);
    } else if (errorMode === 'exception') {
      throwError('Failed to enable NFC suppression', error as ITypedError);
    }
  }
}

export async function disableSuppression(
  errorMode: IErrorsMode = 'silent'
): Promise<void> {
  try {
    await NfcSuppress.enableSuppression();
  } catch (error) {
    if (errorMode === 'console') {
      logError('Failed to disable NFC suppression', error as ITypedError);
    } else if (errorMode === 'exception') {
      throwError('Failed to disable NFC suppression', error as ITypedError);
    }
  }
}

export function getEventEmitter(
  errorMode: IErrorsMode = 'silent'
): NativeEventEmitter | undefined {
  let eventEmitter;
  try {
    eventEmitter = new NativeEventEmitter(NativeModules.NfcSuppress);
  } catch (error) {
    if (errorMode === 'console') {
      logError('Failed to get event emmitter', error as ITypedError);
    } else if (errorMode === 'exception') {
      throwError('Failed to get event emmitter', error as ITypedError);
    }
  }
  return eventEmitter;
}

export function getSuppressionStateListener(
  callback: (state: boolean) => void,
  errorMode: IErrorsMode = 'silent'
): EmitterSubscription | undefined {
  let subscription;
  try {
    const emitter = getEventEmitter(errorMode);
    if (emitter) {
      subscription = emitter.addListener(
        SUPPRESSION_STATE_CHANGED,
        (event: boolean): void => {
          callback(event);
        }
      );
    }
  } catch (error) {
    if (errorMode === 'console') {
      logError(
        'Failed to subscribe on suppression state changes',
        error as ITypedError
      );
    } else if (errorMode === 'exception') {
      throwError(
        'Failed to subscribe on suppression state changes',
        error as ITypedError
      );
    }
  }
  return subscription;
}

export function getNfcStateListener(
  callback: (state: boolean) => void,
  errorMode: IErrorsMode = 'silent'
): EmitterSubscription | undefined {
  let subscription;
  try {
    const emitter = getEventEmitter(errorMode);
    if (emitter) {
      subscription = emitter.addListener(
        NFC_STATE_CHANGED,
        (event: boolean): void => {
          callback(event);
        }
      );
    }
  } catch (error) {
    if (errorMode === 'console') {
      logError(
        'Failed to subscribe on NFC state changes',
        error as ITypedError
      );
    } else if (errorMode === 'exception') {
      throwError(
        'Failed to subscribe on NFC state changes',
        error as ITypedError
      );
    }
  } finally {
    return subscription;
  }
}
