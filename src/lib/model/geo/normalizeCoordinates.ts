export function normalizeCoordinate(number: string | number) {
  const asFloat = typeof number === 'number' ? number : parseFloat(number);
  return Math.round(asFloat * 10000) / 10000;
}

export function normalizeCoordinates([lat, lon]: [string | number, string | number]): [number, number] {
  return [normalizeCoordinate(lat), normalizeCoordinate(lon)];
}
