// @flow

export function normalizeCoordinate(number: number) {
  const asFloat = parseFloat(number);
  return Math.round(asFloat * 10000) / 10000;
}

export function normalizeCoordinates([lat, lon]: [number, number]): [number, number] {
  return [normalizeCoordinate(lat), normalizeCoordinate(lon)];
}
