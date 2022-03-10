import * as React from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextStyle,
} from 'react-native';
import { openNFCSettings, useNFCSuppressor } from 'react-native-nfc-suppress';

const getEnabledColor = (enabled: boolean): TextStyle => ({
  color: enabled ? 'green' : 'red',
});

export default function App() {
  const { suppressed, supported, enabled, enable, disable } =
    useNFCSuppressor();

  const onNfcSettingsPressed = (): void => {
    openNFCSettings();
  };

  const switchSuppression = (): void => {
    if (suppressed) {
      disable();
    } else {
      enable();
    }
  };

  const supportedColor = getEnabledColor(supported);
  const enabledColor = getEnabledColor(enabled);
  const suppressedColor = getEnabledColor(suppressed);

  return (
    <View style={styles.container}>
      <View style={styles.state}>
        <Text style={[styles.text, supportedColor]}>
          {supported ? 'NFC supported' : 'NFC is NOT supported'}
        </Text>
        <Text style={[styles.text, enabledColor]}>
          {enabled ? 'NFC enabled' : 'NFC is NOT enabled'}
        </Text>
        <Text style={[styles.text, suppressedColor]}>
          {suppressed ? 'NFC suppressed' : 'NFC is NOT suppressed'}
        </Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={onNfcSettingsPressed}
          disabled={supported === false}
          style={styles.pressable}
        >
          <Text style={[styles.text]}>{'Go To NFC Settings'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={switchSuppression} style={styles.pressable}>
          <Text style={[styles.text]}>
            {suppressed ? 'Turn Off' : 'Turn On'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#64b5f6',
    display: 'flex',
    padding: 28,
  },
  state: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
  },
  controls: {
    flex: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  text: {
    fontSize: 18,
    lineHeight: 21,
    fontWeight: '800',
    color: '#e0f2f1',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  pressable: {
    width: Dimensions.get('screen').width * 0.42,
    height: 64,
    backgroundColor: '#2286c3',
    borderRadius: 12,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 12,
  },
});
