package com.reactnativenfcsuppress;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.nfc.NfcAdapter;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;

import android.provider.Settings;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.reactnativenfcsuppress.constants.Errors;
import com.reactnativenfcsuppress.constants.Events;

@ReactModule(name = NfcSuppressModule.NAME)
class NfcSuppressModule extends ReactContextBaseJavaModule implements ActivityEventListener, LifecycleEventListener {
  public static final String NAME = "NfcSuppress";

  private ReactApplicationContext reactContext;
  private NfcAdapter nfcAdapter;
  private boolean nfcEnabled;
  private boolean suppressionEnabled;
  private boolean paused;

  public NfcSuppressModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    this.paused = false;
    this.suppressionEnabled = false;
    this.nfcAdapter = NfcAdapter.getDefaultAdapter(reactContext);
    this.nfcEnabled = this.nfcAdapter != null ? nfcAdapter.isEnabled() : false;
    registerNFCStateReceiver();

  }

  private void sendEvent(String eventName, boolean state) {
    this.reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, state);
  }

  @ReactMethod
  public void addListener(String eventName) {
    // Set up any upstream listeners or background tasks as necessary
  }

  @ReactMethod
  public void removeListeners() {
    // Remove upstream listeners, stop unnecessary background tasks
  }

  private void setReaderMode(boolean enabled) throws NFCException {
    try {
      Activity activity = getCurrentActivity();
      boolean executed = false;

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT && nfcEnabled) {
        this.nfcAdapter.disableReaderMode(activity);
        if (enabled) {
          this.nfcAdapter.enableReaderMode(activity, tag -> {
          }, NfcAdapter.FLAG_READER_SKIP_NDEF_CHECK, null);
        } else {
          this.nfcAdapter.disableReaderMode(activity);
        }
        executed = true;
      }
      if (!executed) {
        throw new UnsupportedOperationException();
      }
    } catch (Exception error) {
      throw new NFCException(Errors.EC_SWITCH_NFC_MODE_FAILED, Errors.EC_SWITCH_NFC_MODE_FAILED);
    }
  }

  private void setSuppression(boolean enabled) throws NFCException {
    this.suppressionEnabled = enabled;
    this.sendEvent(Events.SUPPRESSION_STATE_CHANGED, enabled);
    if (this.nfcEnabled) {
      this.setReaderMode(enabled);
    } else {
      this.paused = true;
    }
  }

  private void registerNFCStateReceiver() {
    Log.d(NAME, "registerNFCStateReceiver");
    if (this.nfcAdapter == null) {
      Log.d(NAME, "NFC NOT SUPPORTED");
    } else {
      IntentFilter filter = new IntentFilter(NfcAdapter.ACTION_ADAPTER_STATE_CHANGED);
      this.reactContext.registerReceiver(mReceiver, filter);
    }
  }

  private final BroadcastReceiver mReceiver = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      final String action = intent.getAction();

      if (action.equals(NfcAdapter.ACTION_ADAPTER_STATE_CHANGED)) {
        final int state = intent.getIntExtra(NfcAdapter.EXTRA_ADAPTER_STATE,
          NfcAdapter.STATE_OFF);
        try {
          switch (state) {
            case NfcAdapter.STATE_OFF: {
              nfcEnabled = false;
              sendEvent(Events.NFC_STATE_CHANGED, false);
              if (suppressionEnabled) {
                paused = true;
              }
              break;
            }
            case NfcAdapter.STATE_ON: {
              nfcEnabled = true;
              sendEvent(Events.NFC_STATE_CHANGED, true);
              if (paused) {
               setReaderMode(suppressionEnabled);
              }
              break;
            }
            case NfcAdapter.STATE_TURNING_OFF:
            case NfcAdapter.STATE_TURNING_ON: {
              break;
            }
          }
        } catch (Exception e) {
          Log.d(NAME, e.getMessage());
        }
      }
    }
  };


  @ReactMethod
  public void isNFCSupported(Promise promise) {
    Log.d(NAME, "isNFCSupported");
    promise.resolve(this.nfcAdapter != null);
  }

  @ReactMethod
  public void isNFCEnabled(Promise promise) throws NFCException {
    Log.d(NAME, "isNFCEnabled");
    promise.resolve(this.nfcEnabled);
  }

  @ReactMethod
  public void isNFCSuppressionEnabled(Promise promise) {
    Log.d(NAME, "isNFCSuppressionEnabled");
    promise.resolve(this.suppressionEnabled);
  }

  @ReactMethod
  public void openNFCSettings(Promise promise) {
    Log.d(NAME, "openNfcSettings");
    try {
      boolean opened = false;
      if (this.nfcAdapter != null) {
        Activity activity = getCurrentActivity();
        activity.startActivity(new Intent(Settings.ACTION_NFC_SETTINGS));
        opened = true;
      }
      promise.resolve(opened);
    } catch (Exception e) {
      promise.reject(Errors.EC_GET_ACTIVITY_FAILED, Errors.EM_GET_ACTIVITY_FAILED);
    }
  }

  @ReactMethod
  public void enableSuppression(Promise promise) {
    Log.d(NAME, "enableSuppression");
    try {
      this.setSuppression(true);
      promise.resolve(true);
    } catch (NFCException error) {
      promise.reject(error.getCode(), error.getMessage());
    }
  }

  @ReactMethod
  public void disableSuppression(Promise promise) {
    Log.d(NAME, "disableSuppression");
    try {
      this.setSuppression(false);
      promise.resolve(true);
    } catch (NFCException error) {
      promise.reject(error.getCode(), error.getMessage());
    }
  }

  @Override
  public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

  }

  @Override
  public void onNewIntent(Intent intent) {

  }

  @Override
  public void onHostResume() {
    if (this.paused) {
      try {
        this.setReaderMode(this.suppressionEnabled);
        this.paused = false;
      } catch (NFCException e) {
        e.printStackTrace();
      }
    }
  }

  @Override
  public void onHostPause() {
    try {
      this.paused = true;
      this.setReaderMode(false);
    } catch (NFCException e) {
      e.printStackTrace();
    }

  }

  @Override
  public void onHostDestroy() {
    try {
      this.setReaderMode(false);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }


}
