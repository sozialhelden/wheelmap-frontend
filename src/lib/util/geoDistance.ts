function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180
}

// From http://gis.stackexchange.com/a/20241
function earthRadiusForLatitude(latitudeInDegrees: number, heightAboveSeaLevel: number = 0) {
  if (isNaN(latitudeInDegrees) || latitudeInDegrees > 90 || latitudeInDegrees < -90) {
    throw new Error('Incorrect latitude given.')
  }
  // x = latitude in radians
  const x = toRadians(latitudeInDegrees)
  const r1 = 6378137 // radius at the equator
  const r2 = 6356752 // radius at the poles
  const z = Math.sqrt(
    ((r1 * r1 * Math.cos(x)) ** 2 + (r2 * r2 * Math.sin(x)) ** 2)
      / ((r1 * Math.cos(x)) ** 2 + (r2 * Math.sin(x)) ** 2),
  )
  return z + heightAboveSeaLevel
}

type LonLatPair = [number, number];

// Haversine formula, from http://www.movable-type.co.uk/scripts/latlong.html
export function geoDistance([lon1, lat1]: LonLatPair, [lon2, lat2]: LonLatPair) {
  const radius = earthRadiusForLatitude(lat1 + 0.5 * (lat2 - lat1))
  const phi1 = toRadians(lat1)
  const phi2 = toRadians(lat2)
  const deltaPhi = toRadians(lat2 - lat1)
  const deltaLambda = toRadians(lon2 - lon1)
  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2)
    + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return radius * c
}
