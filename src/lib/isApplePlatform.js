// @flow

export default function isApplePlatform() {
  const userAgent = window.navigator.userAgent;
  return Boolean(userAgent.match(/Apple/));
}
