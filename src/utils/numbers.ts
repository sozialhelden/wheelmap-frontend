/**
 * Get a number in the given range of numbers based on the given percentage.
 */
export function lerp(from: number, to: number, percentage: number): number {
  return from * (1 - percentage) + to * percentage;
}
