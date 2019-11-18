export function isOnSmallViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 512 || window.innerHeight <= 512;
}

export function hasBigViewport(): boolean {
  if (typeof window === 'undefined') return true;
  return window.innerHeight > 512 && window.innerWidth > 512;
}
