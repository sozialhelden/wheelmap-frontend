import { t } from 'ttag'
import { isAccessibilityCloudId } from '../../typing/discriminators/isAccessibilityCloudId'
import { getOSMRDFComponents, isOSMIdWithTableAndContextName } from '../../typing/discriminators/osmDiscriminator'
import type { FetchOneFeatureProperties } from './fetchers'
import type { FeatureId } from './types'

interface ACFetchOptions {
  acBaseUrl: string,
  acAppToken: string
}

interface OSMFetchOptions {
  osmBaseUrl: string,
  osmAppToken: string
}
type FetchOptions = ACFetchOptions & OSMFetchOptions

export const makeFetchProperties = (featureId: FeatureId, {
  acBaseUrl, acAppToken, osmBaseUrl, osmAppToken,
}: Partial<FetchOptions>): FetchOneFeatureProperties => {
  if (isOSMIdWithTableAndContextName(featureId)) {
    if (!osmBaseUrl || !osmAppToken) {
      throw new Error(t`OSM API Configuration incomplete, baseUrl or appToken is missing`)
    }
    const { properties: { table, element, value } } = getOSMRDFComponents(featureId)
    return {
      url: `${osmBaseUrl}/${table}/${element}/${value}.geojson?appToken=${osmAppToken || ''}`,
      typeTag: 'osm:Feature',
      originId: featureId,
    }
  }
  if (isAccessibilityCloudId(featureId)) {
    if (!acBaseUrl || !acAppToken) {
      throw new Error(t`accessibility.cloud API Configuration incomplete, baseUrl or appToken is missing`)
    }
    const [type, id] = featureId.split('/')
    if (type !== 'ac:PlaceInfo') {
      throw new Error(t`Expected an RDF AC string like \`ac:PlaceInfo/[text]\` but received \`${featureId}\``)
    }
    // XXX: Despite using RDF-like URIs, we still use the old API endpoint for place infos that doesn't support our URI format.
    return {
      url: `${acBaseUrl}/place-infos/${id}.json?appToken=${acAppToken}`,
      typeTag: 'ac:PlaceInfo',
      originId: featureId,
    }
  }

  throw new Error(t`The featureId '${featureId}' is of unknown format`)
}
