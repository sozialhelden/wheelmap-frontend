// @flow

export default function isCordova() {
  return typeof window !== 'undefined' && window.cordova;
}

export function isCordovaDebugMode() {
  return typeof window !== 'undefined' && window.cordovaDebugMode;
}

export function activateCordovaDebugMode() {
  if (typeof window !== 'undefined') {
    console.warn('EMULATING CORDOVA ON DESKTOP - behavior in Cordova will differ!');
    window.cordovaDebugMode = true;
  }
}
