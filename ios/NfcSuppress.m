#import "NfcSuppress.h"

@implementation NfcSuppress

RCT_EXPORT_MODULE()

/*
Target version >= 12. Iphones that supports iOS >= 12.
So this method shuold always return TRUE
*/
RCT_EXPORT_METHOD(
  isNfcSupported:
  (RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject
) {

  resolve(@YES);
}


/*
NFC is always enabled on iPhone.
So this method shuold always return TRUE
*/
RCT_EXPORT_METHOD(
  isNfcEnabled:
  (RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject
) {

  resolve(@YES);
}

/*

*/
RCT_EXPORT_METHOD(
  isNfcSuppressionEnabled:
  (RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject
) {

  resolve(@YES);
}


/*

*/
RCT_EXPORT_METHOD(
  isPermissionDeclared:
  (RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject
) {

  resolve(@YES);
}



/*

*/
RCT_EXPORT_METHOD(
  openNfcSettings:
  (RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject
) {

  reject(@YES, @YES, @YES);
}


/*

*/
RCT_EXPORT_METHOD(
  enableSuppression:
  (RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject
) {

  resolve(@YES);
}


/*

*/
RCT_EXPORT_METHOD(
  disableSuppression:
  (RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject
) {

  resolve(@YES);
}









@end
