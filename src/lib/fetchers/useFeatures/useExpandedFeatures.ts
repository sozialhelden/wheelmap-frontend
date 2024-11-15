import type { SWRInfiniteConfiguration } from 'swr/infinite'
import useSWRInfinite from 'swr/infinite'
import { useCurrentAppToken } from '../../context/AppContext'
import { useEnvContext } from '../../context/EnvContext'
import { isPlaceInfo } from '../../model/geo/AnyFeature'
import type { OSMRDFTableElementValue } from '../../typing/brands/osmIds'
import { isAccessibilityCloudId } from '../../typing/discriminators/isAccessibilityCloudId'
import { isOSMRdfTableElementValue } from '../../typing/discriminators/osmDiscriminator'
import { getAccessibilityCloudAPI } from '../ac/useAccessibilityCloudAPI'
import { getOSMAPI } from '../osm-api/useOSMAPI'
import {
  type FetchOneFeatureProperties, type FetchOneFeatureResult, type FetchOsmToAcFeatureResult,
  composeFetchOneFeature,
} from './fetchers'
import type { FeatureId } from './types'
import { useFeatures } from './useFeatures'
import { useOsmToAcFeature } from './useOsmToAcFeature'
import { makeFetchProperties } from './utils'

/**
 * Expands an OpenStreeMap URL to hopeful guesses what OSM RDF ID it may be
 */
const guesstimateRdfType = (osmUris: string[]): OSMRDFTableElementValue[] => osmUris.flatMap((osmUri) => {
  const tail = osmUri.replace('https://openstreetmap.org/', '')
  const [element, value] = tail.split('/')
  if (!element || !value) {
    return []
  }
  // type casting instead of checking, just to satisfy the branding constraint
  return [`osm:amenities/${element}/${value}`, `osm:buildings/${element}/${value}`] as OSMRDFTableElementValue[]
})

export const useExpandedFeatures = (
  features: (FeatureId | undefined)[],
  options?: {
    useFeaturesSWRConfig: SWRInfiniteConfiguration<FetchOneFeatureResult>,
    useOsmToAcSWRConfig: SWRInfiniteConfiguration<FetchOsmToAcFeatureResult>,
    cache?: boolean
  },
) => {
  const initialFeaturesResult = useFeatures(features, options ? { swr: options.useFeaturesSWRConfig, cache: options.cache } : undefined)
  const initialFeatures = initialFeaturesResult.data ?? []

  const osmFeatureIds = features.filter((x) => !!x && isOSMRdfTableElementValue(x)) ?? []
  // eslint-disable-next-line max-len, @stylistic/js/max-len
  const additionalAcFeatureResult = useOsmToAcFeature(osmFeatureIds, options ? { swr: options.useOsmToAcSWRConfig, cache: options.cache } : undefined)

  // eslint-disable-next-line max-len, @stylistic/js/max-len
  // const sameAsFeatureIds = initialFeatures?.flatMap((x) => (isPlaceInfo(x.feature) ? guesstimateRdfType(x.feature.properties.sameAs ?? []) : undefined))
  // .filter((y): y is OSMRDFTableElementValue => typeof y === 'string') ?? []

  const env = useEnvContext()
  const currentAppToken = useCurrentAppToken()

  const { baseUrl: osmBaseUrl, appToken: osmAppToken } = getOSMAPI(env, currentAppToken, options?.cache ?? false)
  const { baseUrl: acBaseUrl, appToken: acAppToken } = getAccessibilityCloudAPI(env, currentAppToken, options?.cache ?? false)
  // eslint-disable-next-line max-len, @stylistic/js/max-len
  const osmRelationProperties: { osmUris: string[], requestProperties: Record<string, FetchOneFeatureProperties> } = { osmUris: [], requestProperties: { } }
  for (const initialFeature of initialFeatures) {
    // @TODO: Typing here is somewhat poor, need to coerce both ID and Feature, when in reality one would suffice
    if (isAccessibilityCloudId(initialFeature.id) && isPlaceInfo(initialFeature.feature)) {
      const guesstimatedRdfTypes = guesstimateRdfType(initialFeature.feature.properties.sameAs ?? [])
      if (guesstimateRdfType.length <= 0) {
        continue
      }
      const properties = guesstimatedRdfTypes.map((x) => ({
        ...makeFetchProperties(x, {
          acBaseUrl, acAppToken, osmBaseUrl, osmAppToken,
        }),
        id: initialFeature.id,
      }))
      for (const property of properties) {
        osmRelationProperties.requestProperties[property.url] = property
      }
      osmRelationProperties.osmUris.push(...(properties.map((x) => x.url)))
    }
  }
  const additionalOSMFeaturesFetcher = composeFetchOneFeature(osmRelationProperties.requestProperties)

  // eslint-disable-next-line max-len, @stylistic/js/max-len
  const additionalOSMFeaturesResult = useSWRInfinite((idx) => osmRelationProperties.osmUris[idx], additionalOSMFeaturesFetcher, options?.useFeaturesSWRConfig)
  return {
    requestedFeatures: initialFeaturesResult,
    additionalAcFeatures: additionalAcFeatureResult,
    additionalOsmFeatures: additionalOSMFeaturesResult,

    isLoading: initialFeaturesResult.isLoading || additionalAcFeatureResult.isLoading || additionalOSMFeaturesResult.isLoading,
    isValidating: initialFeaturesResult.isValidating || additionalAcFeatureResult.isValidating || additionalOSMFeaturesResult.isValidating,
  }
}
