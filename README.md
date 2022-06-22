# react-native-nfc-suppress

Allow disabling of Google pay and Apple pay if needed.

Contributions are welcome!

## Installation

```sh
npm install react-native-nfc-suppress
```

#### Android

Update **AndroidManifest.xml**

```sh
<uses-permission android:name="android.permission.NFC" />
```

#### iOS

This library use native-modules, so you will need to do pod install for iOS:

```sh
cd ios && pod install && cd ..
```

## Usage

```sh
import React from 'react';

import {
  View,
  Text,
  Button,
} from 'react-native';

import { useNfcSuppressor } from 'react-native-nfc-suppress';

export const ExampleComponent= () => {
  const { suppressed, supported, enabled, enable, disable } = useNfcSuppressor();

  return (
    <View style={{display:'flex', flexDirection:'column'}}>
      <Text>{`Is NFC enabled: ${supported}`}</Text>
      <Text>{`Is NFC enabled: ${enabled}`}</Text>
      <Text>{`Is enabled: ${suppressed}`}</Text>
      <Button title="Switch" onPress={switchSuppression} />
    <View>	 
   )
}
```

## Docs

#### Hooks

##### useNfcSupportedState
Return boolean value. Channel NFC support state.
Value updates on state change.

##### useNfcEnabledState
Return boolean value. Channel NFC state.
Value updates on state change.

##### useNfcSuppressionState
Return boolean value. Channel NFC suppresion state.
Value updates on state change.

##### useNfcSuppressor
Return object. Expose all module functionality.

## License

[MIT](https://choosealicense.com/licenses/mit/)
