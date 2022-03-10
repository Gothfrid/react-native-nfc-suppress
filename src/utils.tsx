import { Platform, PlatformOSType } from 'react-native';

export function isFeatureSupported(targets: PlatformOSType[]): boolean {
  let result = false;
  if (targets.includes(Platform.OS)) {
    result = true;
  }
  return result;
}
