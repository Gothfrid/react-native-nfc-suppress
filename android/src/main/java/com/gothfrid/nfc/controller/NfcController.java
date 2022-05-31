package com.gothfrid.nfc.controller;

import android.app.Activity;
import android.util.Log;
import android.os.Build;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.nfc.NfcAdapter;

import com.facebook.react.bridge.ReactApplicationContext;

import com.gothfrid.nfc.utils.Errors;
import com.gothfrid.nfc.utils.NFCException;

public class NfcController {

  private NfcAdapter nfcAdapter;
  private ReactApplicationContext reactContext;
  private IStateChangeListener stateChangeListener;
  private boolean enabled = false;

  private final BroadcastReceiver stateChangeReceiver = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      final String action = intent.getAction();

      if (action.equals(NfcAdapter.ACTION_ADAPTER_STATE_CHANGED)) {
        final int state = intent.getIntExtra(NfcAdapter.EXTRA_ADAPTER_STATE,
            NfcAdapter.STATE_OFF);

        switch (state) {
          case NfcAdapter.STATE_OFF: {
            enabled = false;
            break;
          }
          case NfcAdapter.STATE_ON: {
            enabled = true;
            break;
          }
          case NfcAdapter.STATE_TURNING_OFF:
          case NfcAdapter.STATE_TURNING_ON: {
            break;
          }
        }
        if (stateChangeListener != null) {
          stateChangeListener.onChange(enabled);
        }
      }
    }
  };

  public NfcController(ReactApplicationContext reactContext) {

    this.reactContext = reactContext;
    if (this.isNfcSupported()) {
      this.enabled = this.nfcAdapter.isEnabled();
      IntentFilter filter = new IntentFilter(NfcAdapter.ACTION_ADAPTER_STATE_CHANGED);
      reactContext.registerReceiver(stateChangeReceiver, filter);
    }

  }

  public void registerNfcStateListener(IStateChangeListener listener) {
    this.stateChangeListener = listener;
  }

  public NfcAdapter getNfcAdapter() {
    return this.nfcAdapter;
  }

  public boolean isNfcSupported() {
    return this.nfcAdapter != null;
  }

  public boolean isNfcEnabled() {
    return this.enabled;
  }

  public void setReaderMode(boolean enabled) throws NFCException {
    try {
      boolean executed = false;
      Activity activity = reactContext.getCurrentActivity();

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT && this.enabled) {
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

}
