package com.gothfrid.nfc;

import android.app.Activity;
import android.content.Intent;

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

import com.gothfrid.nfc.controller.NfcController;
import com.gothfrid.nfc.controller.IStateChangeListener;

import com.gothfrid.nfc.utils.Errors;
import com.gothfrid.nfc.utils.Events;
import com.gothfrid.nfc.utils.NFCException;
import com.gothfrid.nfc.utils.NfcPermission;

@ReactModule(name = NfcSuppressModule.NAME)
class NfcSuppressModule extends ReactContextBaseJavaModule implements ActivityEventListener, LifecycleEventListener {
  public static final String NAME = "NfcSuppress";

  private ReactApplicationContext reactContext;
  private NfcController nfcController;

  private boolean permissionDeclared;
  private boolean suppressionEnabled;
  private boolean paused;

  private final IStateChangeListener onStateChangeReceiver = state -> sendEvent(Events.NFC_STATE_CHANGED, state);

  public NfcSuppressModule(ReactApplicationContext reactContext) {
    super(reactContext);

    this.reactContext = reactContext;
    this.paused = false;
    this.suppressionEnabled = false;
    this.permissionDeclared = NfcPermission.hasNfcPermissions(reactContext);
    this.nfcController = new NfcController(reactContext);
    this.nfcController.registerNfcStateListener(onStateChangeReceiver);

  }

  private void setSuppression(boolean enabled) throws NFCException {
    if (this.nfcController.isNfcEnabled()) {
      this.nfcController.setReaderMode(enabled);
    } else {
      this.paused = true;
    }
    this.suppressionEnabled = enabled;
    this.sendEvent(Events.SUPPRESSION_STATE_CHANGED, enabled);
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

  @ReactMethod
  public void isPermissionDeclared(Promise promise) {
    promise.resolve(this.permissionDeclared);
  }

  @ReactMethod
  public void isNfcSupported(Promise promise) {
    promise.resolve(this.nfcController.isNfcSupported());
  }

  @ReactMethod
  public void isNfcEnabled(Promise promise) throws NFCException {
    promise.resolve(this.nfcController.isNfcEnabled());
  }

  @ReactMethod
  public void isNfcSuppressionEnabled(Promise promise) {
    promise.resolve(this.suppressionEnabled);
  }

  @ReactMethod
  public void openNfcSettings(Promise promise) {
    try {
      boolean opened = false;
      if (this.nfcController.isNfcSupported()) {
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
    try {
      this.setSuppression(true);
      promise.resolve(true);
    } catch (NFCException error) {
      promise.reject(error.getCode(), error.getMessage());
    }
  }

  @ReactMethod
  public void disableSuppression(Promise promise) {
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
        this.paused = false;
        this.nfcController.setReaderMode(this.suppressionEnabled);
      } catch (NFCException e) {
        e.printStackTrace();
      }
    }
  }

  @Override
  public void onHostPause() {
    try {
      this.paused = true;
      this.nfcController.setReaderMode(false);
    } catch (NFCException e) {
      e.printStackTrace();
    }

  }

  @Override
  public void onHostDestroy() {
    try {
      this.nfcController.setReaderMode(false);
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
