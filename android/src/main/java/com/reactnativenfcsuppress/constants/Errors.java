package com.reactnativenfcsuppress.constants;

public class Errors {




  public static final String EC_GET_ACTIVITY_FAILED = "EC_001";
  public static final String EM_GET_ACTIVITY_FAILED = "Failed to get current Activity";

  public static final String EC_GET_NFC_NOT_SUPPORTED = "EC_002";
  public static final String EM_GET_NFC_NOT_SUPPORTED = "NFC isn't supported";

  public static final String EC_SWITCH_NFC_MODE_FAILED = "EC_003";
  public static final String EM_SWITCH_NFC_MODE_FAILED = "Failed to switch MFC Mode";

  private Errors() {
    throw new AssertionError();
  }
}
