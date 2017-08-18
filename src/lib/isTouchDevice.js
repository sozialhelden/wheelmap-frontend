export default function isTouchDevice() {
  return window.navigator.maxTouchPoints > 0 ||
    window.navigator.userAgent.match(/iPhone/) ||
    window.navigator.userAgent.match(/iPad/);
}
