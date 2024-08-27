import { AnyFeature } from '../geo/AnyFeature'
import OSMFeature from './OSMFeature'

function getLatLonFromFeature(
  feature: AnyFeature,
): { lat: number; lon: number } {
  if (
    feature
    && feature.geometry
    && feature.geometry.type === 'Point'
    && feature.geometry.coordinates instanceof Array
  ) {
    return {
      lat: feature.geometry.coordinates[1],
      lon: feature.geometry.coordinates[0],
    }
  }

  throw new Error('Could not extract LatLon from Feature')
}

type MaybeLatLon = { lat: number | undefined; lon: number | undefined };

export function generateOsmNoteUrlForCoords(coords: MaybeLatLon) {
  if (coords && coords.lat && coords.lon) {
    return `https://www.openstreetmap.org/note/new#map=19/${coords.lat}/${coords.lon}&layers=N`
  }
  return 'https://www.openstreetmap.org/note/new'
}

export function generateOsmEditorUrlForCoords(coords?: MaybeLatLon) {
  if (coords && coords.lat && coords.lon) {
    return `https://www.openstreetmap.org/edit#map=19/${coords.lat}/${coords.lon}`
  }
  return 'https://www.openstreetmap.org/edit'
}

// aligns note links for ways vs. nodes in osm
export function generateOsmNoteUrl(feature: AnyFeature) {
  if (!feature || !feature.properties) {
    return 'https://www.openstreetmap.org/note/new'
  }

  const coords = getLatLonFromFeature(feature)
  return generateOsmNoteUrlForCoords(coords)
}

export function getOSMType(feature?: OSMFeature) {
  if (!feature) {
    return undefined
  }
  if (Number.parseInt(feature._id, 10) < 0) {
    return 'way'
  }
  return 'node'
}

export function generateShowOnOsmUrl(feature: AnyFeature) {
  if (!feature || !feature.properties) {
    return null
  }

  if (feature['@type'] === 'osm:Feature') {
    const osmId = feature._id
    return `https://www.openstreetmap.org/${osmId}`
  }

  if (feature['@type'] === 'a11yjson:PlaceInfo') {
    const { sameAs } = feature.properties
    const osmUrl = sameAs
      && sameAs.find((url: string) => url.startsWith('https://www.openstreetmap.org/'))
    if (osmUrl) {
      return osmUrl
    }
  }

  const coords = getLatLonFromFeature(feature)
  return `https://www.openstreetmap.org/#map=19/${coords.lat}/${coords.lon}`
}
