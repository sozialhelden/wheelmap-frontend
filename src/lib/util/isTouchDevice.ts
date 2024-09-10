export const isTouchDevice = (options?: { matchAnyPointer: boolean }) => {
  if (!window) {
    return false
  }

  // any-pointer: touch devices with mice attached
  // pointer: touch devices with no mice attached
  const selector = options?.matchAnyPointer ? 'any-pointer' : 'pointer'
  return window.matchMedia(`(${selector}: coarse)`).matches
}
