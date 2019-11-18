if (typeof Math.sinh === 'undefined') {
  Math.sinh = x => (Math.exp(x) - Math.exp(-x)) / 2;
}

function tile2LatLon(x: number, y: number, z: number): [number, number] {
  const n = 2.0 ** z;
  const lonDeg = x / n * 360.0 - 180.0;
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n)));
  const latDeg = 180.0 * (latRad / Math.PI);
  return [Number(latDeg.toFixed(4)), Number(lonDeg.toFixed(4))];
}

export type TileCoords = { x: number, y: number, z: number };
export type Bbox = [number, number, number, number];

export default function geoTileToBbox({ x, y, z }: TileCoords): Bbox {
  const [north, west] = tile2LatLon(x + 1, y + 1, z);
  const [south, east] = tile2LatLon(x, y, z);

  return [east, north, west, south];
}
