import { Feature } from 'geojson'
import { normalizeCoordinates } from './normalizeCoordinates'

// returns coordinates in [lon, lat] array

export function normalizedCoordinatesForFeature(
  feature: Feature,
): [number, number] | null {
  const geometry = feature ? feature.geometry : null
  if (!(geometry instanceof Object)) return null
  if (geometry.type === 'GeometryCollection') return null
  const { coordinates } = geometry
  if (!(coordinates instanceof Array) || coordinates.length !== 2) return null
  // @ts-ignore
  return normalizeCoordinates(coordinates)
}
