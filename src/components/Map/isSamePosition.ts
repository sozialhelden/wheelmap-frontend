type LatLng = [number, number];

export default function isSamePosition(
  latlon: LatLng,
  latlon2: LatLng,
  maximalDistance: number = 0.001
) {
  if (
    typeof latlon[0] === 'undefined' ||
    typeof latlon[1] === 'undefined' ||
    typeof latlon2[0] === 'undefined' ||
    typeof latlon2[1] === 'undefined'
  )
    return false;

  return (
    latlon &&
    Math.abs(latlon[0] - latlon2[0]) <= maximalDistance &&
    Math.abs(latlon[1] - latlon2[1]) <= maximalDistance
  );
}
