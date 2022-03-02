package com.reactnativenfcsuppress.constants;

public class Errors {
  public static final String ERROR_CODE_GET_ACTIVITY_FAILED = "EC_001";
  public static final String ERROR_MESSAGE_GET_ACTIVITY_FAILED = "Failed to get current Activity";

  public static final String ERROR_CODE_GET_NFC_ADAPTER_FAILED = "EC_002";
  public static final String ERROR_MESSAGE_GET_NFC_ADAPTER_FAILED = "Failed to get MFC Adapter";

  public static final String ERROR_CODE_SWITCH_NFC_MODE_FAILED = "EC_003";
  public static final String ERROR_MESSAGE_SWITCH_NFC_MODE_FAILED = "Failed to switch MFC Mode";

  private Errors() {
    throw new AssertionError();
  }
}
