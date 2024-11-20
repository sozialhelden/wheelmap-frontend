import { PhotonResultFeature } from '../../lib/fetchers/fetchPhotonFeatures'
import { OSMRDFTableElementValue } from '../../lib/typing/brands/osmIds'

const typeMap = {
  N: 'node',
  W: 'way',
  R: 'relation',
} as const

export function mapOsmType(feature: PhotonResultFeature) {
  return typeMap[feature.properties.osm_type || 'N'] || 'node'
}

const collectionMap = {
  elevator: 'elevators',
  'highway:elevator': 'elevators',
  building: 'buildings',
  'place:house': 'entrances_or_exits',
} as const

// `${key}:${value}`
// 'highway:elevator' -> 'elevators'

export function mapOsmCollection(feature: PhotonResultFeature) {
  const combinedKey = `${feature.properties.osm_key}:${feature.properties.osm_value}`
  const secondaryKey = `${feature.properties.osm_key}`

  return collectionMap[combinedKey] || collectionMap[secondaryKey] || 'amenities'
}

export function buildId(feature: PhotonResultFeature) {
  const osmType = mapOsmType(feature)

  if (feature.properties.osm_key === 'place' && feature.properties.osm_value !== 'house') {
    return undefined
  }

  const collection = mapOsmCollection(feature)
  return `osm:${collection}/${osmType}/${feature.properties.osm_id}` as OSMRDFTableElementValue
}

export function buildOSMUri(feature: PhotonResultFeature) {
  // do not resolve places, as these are regularly mistyped in AC
  if (feature.properties.osm_key === 'place') {
    return undefined
  }

  const osmType = mapOsmType(feature)

  return `https://openstreetmap.org/${osmType}/${feature.properties.osm_id}`
}
