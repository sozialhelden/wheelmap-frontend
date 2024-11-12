import { t } from 'ttag'
import { isAccessibilityCloudId } from '../../typing/discriminators/isAccessibilityCloudId'
import { getOSMRDFComponents, isOSMRdfTableElementValue } from '../../typing/discriminators/osmDiscriminator'
import { FeatureId } from './types'

interface ACFetchOptions {
  acBaseUrl: string,
  acAppToken: string
}

interface OSMFetchOptions {
  osmBaseUrl: string,
  osmAppToken: string
}
type FetchOptions = ACFetchOptions & OSMFetchOptions

export const makeFetchUri = (featureId: FeatureId, {
  acBaseUrl, acAppToken, osmBaseUrl, osmAppToken,
}: Partial<FetchOptions>) => {
  if (isOSMRdfTableElementValue(featureId)) {
    if (!osmBaseUrl || !osmAppToken) {
      throw new Error(t`OSM API Configuration incomplete, baseUrl or appToken was missing`)
    }
    const { properties: { table, element, value } } = getOSMRDFComponents(featureId)
    return `${osmBaseUrl}/${table}/${element}/${value}.geojson?appToken=${osmAppToken || ''}`.replaceAll('//', '/')
  }
  if (isAccessibilityCloudId(featureId)) {
    if (!acBaseUrl || !acAppToken) {
      throw new Error(t`AccessibilityCloud API Configuration incomplete, baseUrl or appToken was missing`)
    }
    return `${acBaseUrl}/place-infos/${featureId}.json?appToken=${acAppToken}`
  }
  console.warn('undefined')
  throw new Error(t`The featureId '${featureId}' is of unknown format`)
}
