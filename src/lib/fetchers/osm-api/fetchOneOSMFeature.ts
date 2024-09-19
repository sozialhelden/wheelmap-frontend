import { singularize } from 'inflection'
import { t } from 'ttag'
import OSMFeature from '../../model/osm/OSMFeature'
import ResourceError from '../ResourceError'

export async function fetchOneOSMFeature(
  { baseUrl, appToken, prefixedId }
  : { baseUrl: string, appToken: string, prefixedId: string | undefined },
): Promise<OSMFeature | undefined> {
  const [collectionName, osmType, id] = prefixedId?.split(':') ?? []

  if (!collectionName) {
    throw new Error(`Invalid OSM feature collection name, ${id} does not match collection:key:id pattern`)
  }
  if (!osmType) {
    throw new Error(`Invalid OSM feature type, ${id} does not match collection:key:id pattern`)
  }
  if (!id) {
    throw new Error(`Invalid OSM feature ID, ${id} does not match collection:key:id pattern`)
  }

  const url = `${baseUrl}/${collectionName}/${osmType}/${id}.geojson?appToken=${appToken || ''}`
  const response = await fetch(url)
  if (!response.ok) {
    const errorResponse = await response.json()
    const singularCollectionName = singularize(collectionName)
    const defaultReason = t`Sorry! Could not load ${singularCollectionName} ${id}, a ${osmType} from OpenStreetMap.`

    throw new ResourceError(errorResponse.reason || defaultReason, errorResponse.details, response.status, response.statusText)
  }
  return response.json()
}
