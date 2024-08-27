export function calculateBoundingBox(lat: number, lon: number, radius: number) {
  const latRadian = (lat * Math.PI) / 180
  const degLatKm = 110.574235
  const degLongKm = 110.572833 * Math.cos(latRadian)
  const deltaLat = radius / 1000.0 / degLatKm
  const deltaLong = radius / 1000.0 / degLongKm

  const topLat = lat + deltaLat
  const bottomLat = lat - deltaLat
  const leftLng = lon - deltaLong
  const rightLng = lon + deltaLong

  return {
    west: leftLng,
    east: rightLng,
    north: topLat,
    south: bottomLat,
  }
}
