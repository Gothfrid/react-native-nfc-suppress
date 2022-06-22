import type { ITypedError } from './types';

export function logError(label: string, error?: ITypedError) {
  const { code = '', message = '' } = error || {};
  console.error(`${label}: [${code}] '${message}'`);
}

export function throwError(label: string, error?: ITypedError) {
  const { code = '', message = '' } = error || {};
  throw new Error(`${label}: [${code}] '${message}'`);
}

export const SUPPRESSION_STATE_CHANGED = 'suppress_state_changed' as const;
export const NFC_STATE_CHANGED = 'nfc_state_changed' as const;
