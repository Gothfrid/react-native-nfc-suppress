package com.gothfrid.nfc.utils;

import android.content.Context;
import android.content.pm.PackageManager;

public class NfcPermission {

  public static boolean hasNfcPermissions(Context context) {
    boolean hasPermission = false;
    try {
      String[] permissions = context
        .getPackageManager()
        .getPackageInfo(context.getPackageName(), PackageManager.GET_PERMISSIONS)
        .requestedPermissions;
      for (String permission : permissions) {
        if (permission.equals("android.permission.NFC")) {
          hasPermission = true;
        }
      }
    } finally {
      return hasPermission;
    }
  }

}

