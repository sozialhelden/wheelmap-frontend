import { singularize } from 'inflection'
import { t } from 'ttag'
import OSMFeature from '../../model/osm/OSMFeature'
import ResourceError from '../ResourceError'

export async function fetchOneOSMFeature([
  baseUrl,
  prefixedId,
]: [string, string | undefined]): Promise<OSMFeature | undefined> {
  const [collectionName, osmType, id] = prefixedId?.split(':') ?? []
  const url = `${baseUrl}/${collectionName}/${osmType}/${id}.geojson`
  const response = await fetch(url)
  if (!response.ok) {
    const errorResponse = await response.json()
    const singularCollectionName = singularize(collectionName)
    const defaultReason = t`Sorry! Could not load ${singularCollectionName} ${id}, a ${osmType} from OpenStreetMap.`

    throw new ResourceError(errorResponse.reason || defaultReason, errorResponse.details, response.status, response.statusText)
  }
  return response.json()
}
