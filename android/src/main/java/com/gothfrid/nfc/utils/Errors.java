package com.gothfrid.nfc.utils;

public class Errors {

  public static final String EC_GET_ACTIVITY_FAILED = "EC_001";
  public static final String EM_GET_ACTIVITY_FAILED = "Failed to get current Activity";

  public static final String EC_SWITCH_NFC_MODE_FAILED = "EC_002";
  public static final String EM_SWITCH_NFC_MODE_FAILED = "Failed to switch MFC Mode";

  private Errors() {
    throw new AssertionError();
  }
}
