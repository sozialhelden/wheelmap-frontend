// @flow

export default function isAndroidPlatform() {
  const userAgent = window.navigator.userAgent;
  return Boolean(userAgent.match(/Android/));
}
