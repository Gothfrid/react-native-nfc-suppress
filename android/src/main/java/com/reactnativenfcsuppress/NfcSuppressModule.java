package com.reactnativenfcsuppress;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import android.provider.Settings;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.reactnativenfcsuppress.constants.Errors;
import com.reactnativenfcsuppress.constants.Mode;

@ReactModule(name = NfcSuppressModule.NAME)
public class NfcSuppressModule extends ReactContextBaseJavaModule {
  private static final String LOG_TAG = "NfcSuppressModule";
  public static final String NAME = "NfcSuppress";

  private ReactApplicationContext reactContext;
  private boolean suppressionEnabled;

  public NfcSuppressModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    this.suppressionEnabled = false;
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  private Activity getActivity() throws NFCException {
    Activity activity = getCurrentActivity();
    if (activity == null) {
      throw new NFCException(Errors.ERROR_CODE_GET_ACTIVITY_FAILED, Errors.ERROR_MESSAGE_GET_ACTIVITY_FAILED);
    }
    return activity;
  }

  private NfcAdapter getNFCAdapter() throws NFCException {
    boolean supported = this.isSupported();
    NfcAdapter nfcAdapter = null;
    if (supported) {
      nfcAdapter = NfcAdapter.getDefaultAdapter(reactContext);
    }
    if (!supported || nfcAdapter == null) {
      throw new NFCException(Errors.ERROR_CODE_GET_NFC_ADAPTER_FAILED, Errors.ERROR_MESSAGE_GET_NFC_ADAPTER_FAILED);
    }
    return nfcAdapter;
  }

  private boolean isEnabled() throws NFCException {
    NfcAdapter nfcAdapter = this.getNFCAdapter();
    boolean enabled = nfcAdapter.isEnabled();
    return enabled;
  }


  private void setNFCAdapterReaderMode(Mode mode) throws NFCException {
    NfcAdapter nfcAdapter = this.getNFCAdapter();
    Activity activity = this.getActivity();
    boolean nfcEnabled = nfcAdapter.isEnabled();
    try {
      boolean wasSet = false;
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT && nfcEnabled) {
        if (mode == Mode.ENABLED) {
          nfcAdapter.disableReaderMode(activity);
          nfcAdapter.enableReaderMode(activity, new NfcAdapter.ReaderCallback() {
            @Override
            public void onTagDiscovered(Tag tag) {

            }
          }, NfcAdapter.FLAG_READER_SKIP_NDEF_CHECK, null);
          this.suppressionEnabled = true;
          wasSet = true;
        } else {
          nfcAdapter.disableReaderMode(activity);
          this.suppressionEnabled = false;
          wasSet = true;
        }
      }
      if (!nfcEnabled || !wasSet) {
        throw new UnsupportedOperationException();
      }
    } catch (
      UnsupportedOperationException error) {
      throw new NFCException(Errors.ERROR_CODE_SWITCH_NFC_MODE_FAILED, Errors.ERROR_MESSAGE_SWITCH_NFC_MODE_FAILED);
    }
  }

  private boolean isSupported() throws NFCException {
    boolean supported = false;
    Activity activity = this.getActivity();
    if (activity.getPackageManager().hasSystemFeature(PackageManager.FEATURE_NFC)) {
      supported = true;
    }
    return supported;
  }

  @ReactMethod
  public void isNFCSupported(Promise promise) throws NFCException {
    Log.d(LOG_TAG, "isNFCSupported");
    try {
      boolean supported = this.isSupported();
      promise.resolve(supported);
    } catch (NFCException error) {
      promise.reject(error.getCode(), error.getMessage());
    }
  }

  @ReactMethod
  public void isNFCEnabled(Promise promise) throws NFCException {
    Log.d(LOG_TAG, "isNFCEnabled");
    try {
      boolean enabled = this.isEnabled();
      promise.resolve(enabled);
    } catch (NFCException error) {
      promise.reject(error.getCode(), error.getMessage());
    }
  }

  @ReactMethod
  public void openNfcSettings(Promise promise) {
    Log.d(LOG_TAG, "openNfcSettings");
    try {
      boolean opened = false;
      boolean supported = this.isSupported();
      if (supported) {
        Activity activity = this.getActivity();
        activity.startActivity(new Intent(Settings.ACTION_NFC_SETTINGS));
        opened = true;
      }
      promise.resolve(opened);
    } catch (NFCException error) {
      promise.reject(error.getCode(), error.getMessage());
    }
  }

  @ReactMethod
  public void isNFCSuppressionEnabled(Promise promise) {
    Log.d(LOG_TAG, "isNFCSuppressionEnabled");
    promise.resolve(this.suppressionEnabled);
  }

  @ReactMethod
  public void enableSuppression(Promise promise) {
    Log.d(LOG_TAG, "enable");
    try {
      this.setNFCAdapterReaderMode(Mode.ENABLED);
      promise.resolve(true);
    } catch (NFCException error) {
      promise.reject(error.getCode(), error.getMessage());
    }
  }

  @ReactMethod
  public void disableSuppression(Promise promise) {
    Log.d(LOG_TAG, "disable");
    try {
      this.setNFCAdapterReaderMode(Mode.DISABLED);
      promise.resolve(true);
    } catch (NFCException error) {
      promise.reject(error.getCode(), error.getMessage());
    }
  }


}
