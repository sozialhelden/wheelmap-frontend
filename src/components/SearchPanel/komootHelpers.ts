import { KomootPhotonResultFeature } from '../../lib/fetchers/fetchPlacesOnKomootPhoton'

export function mapOsmType(feature: KomootPhotonResultFeature) {
  return {
    N: 'node',
    W: 'way',
    R: 'relation',
  }[feature.properties.osm_type || 'N']
}

export function mapOsmCollection(feature: KomootPhotonResultFeature) {
  return {
    elevator: 'elevators',
    building: 'buildings',
  }[feature.properties.osm_key || 'amenities'] || 'amenities'
}

export function buildId(feature: KomootPhotonResultFeature) {
  const osmType = mapOsmType(feature)

  if (feature.properties.osm_key === 'place') {
    return undefined
  }

  const collection = mapOsmCollection(feature)
  return `${collection}:${osmType}:${feature.properties.osm_id}`
}

export function buildOSMUri(feature: KomootPhotonResultFeature) {
  // do not resolve places, as these are regularly mistyped in AC
  if (feature.properties.osm_key === 'place') {
    return undefined
  }

  const osmType = mapOsmType(feature)

  return `https://openstreetmap.org/${osmType}/${feature.properties.osm_id}`
}
