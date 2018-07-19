export function isOnSmallViewport() {
  return window.innerWidth <= 512 || window.innerHeight <= 512;
}

export function hasBigViewport() {
  return window.innerHeight > 512 && window.innerWidth > 512;
}