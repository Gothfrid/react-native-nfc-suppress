import { NativeModules, Platform } from 'react-native';

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
    supported = await NfcSuppress.isNFCSupported();
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

export async function openNfcSettings(): Promise<void> {
  try {
    await NfcSuppress.openNfcSettings();
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
