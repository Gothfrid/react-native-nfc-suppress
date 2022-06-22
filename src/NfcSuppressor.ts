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

/**
 * This method checks if NFC is supported.
 * Can return Boolean or undefined in case of Error.
 * @param errorMode level on error propagation
 * @returns value of nfc support state
 */
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

/**
 * This method checks if the required permission declaration is set.
 * Can return Boolean or undefined in case of Error.
 * @param errorMode level on error propagation
 * @returns value of permission declaration state
 */
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

/**
 * This method checks if NFC functionality is enabled.
 * Can return Boolean or undefined in case of Error.
 * @param errorMode level on error propagation
 * @returns value of permission declaration state
 */
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

/**
 * This method checks if NFC suppression is enabled.
 * Can return Boolean or undefined in case of Error.
 * @param errorMode level on error propagation
 * @returns value of nfc suppression state
 */
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

/**
 * This method will open NFC settings.
 * @param errorMode level on error propagation
 */
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

/**
 * Turn on NFC suppresion
 * @param errorMode level on error propagation
 */
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

/**
 * Turn off NFC supprestion
 * @param errorMode level on error propagation
 */
export async function disableSuppression(
  errorMode: IErrorsMode = 'silent'
): Promise<void> {
  try {
    await NfcSuppress.disableSuppression();
  } catch (error) {
    if (errorMode === 'console') {
      logError('Failed to disable NFC suppression', error as ITypedError);
    } else if (errorMode === 'exception') {
      throwError('Failed to disable NFC suppression', error as ITypedError);
    }
  }
}

/**
 * This method exposes NativeEventEmiter that allows subscribing to events from the module.
 * Return NativeEventEmitter or undefined in case of Error.
 * @param errorMode level on error propagation
 */
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

/**
 * This method allows set callback on NFC suppression state change.
 * Return EmitterSubscription or undefined in case of Error.
 * @param errorMode level on error propagation
 */
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

/**
 * This method allows set callback on NFC state change.
 * Return EmitterSubscription or undefined in case of Error.
 * @param errorMode level on error propagation
 */
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
