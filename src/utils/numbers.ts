/**
 * Get a number in the given range of numbers based on the given factor.
 */
export function lerp(from: number, to: number, factor: number): number {
  return from * (1 - factor) + to * factor;
}
