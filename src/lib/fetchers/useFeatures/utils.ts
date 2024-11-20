import { t } from 'ttag'
import { isAccessibilityCloudId } from '../../typing/discriminators/isAccessibilityCloudId'
import { getOSMRDFComponents, isOSMRdfTableElementValue } from '../../typing/discriminators/osmDiscriminator'
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
  if (isOSMRdfTableElementValue(featureId)) {
    if (!osmBaseUrl || !osmAppToken) {
      throw new Error(t`OSM API Configuration incomplete, baseUrl or appToken was missing`)
    }
    const { properties: { table, element, value } } = getOSMRDFComponents(featureId)
    return {
      url: `${osmBaseUrl}/${table}/${element}/${value}.geojson?appToken=${osmAppToken || ''}`.replaceAll('//', '/'),
      typeTag: 'osm:Feature',
      originId: featureId,
    }
  }
  if (isAccessibilityCloudId(featureId)) {
    if (!acBaseUrl || !acAppToken) {
      throw new Error(t`AccessibilityCloud API Configuration incomplete, baseUrl or appToken was missing`)
    }
    const [type, id] = featureId.split('/')
    if (type !== 'ac:PlaceInfo') {
      throw new Error(t`Expected an RDF AC string like \`ac:PlaceInfo/[text]\` but received \`${featureId}\``)
    }
    return {
      url: `${acBaseUrl}/place-infos/${id}.json?appToken=${acAppToken}`,
      typeTag: 'ac:PlaceInfo',
      originId: featureId,
    }
  }
  throw new Error(t`The featureId '${featureId}' is of unknown format`)
}
