// @flow

export default function isCordova() {
  return typeof window !== 'undefined' && window.cordova;
}
