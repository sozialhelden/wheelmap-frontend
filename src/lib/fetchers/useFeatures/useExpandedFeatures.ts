import { SWRInfiniteConfiguration } from 'swr/infinite'
import { FetchOneFeatureResult, FetchOsmToAcFeatureResult } from './fetchers'
import { useFeatures } from './useFeatures'
import { useOsmToAcFeature } from './useOsmToAcFeature'
import { isOSMRdfTableElementValue } from '../../typing/discriminators/osmDiscriminator'
import { isPlaceInfo } from '../../model/geo/AnyFeature'
import { OSMRDFTableElementValue } from '../../typing/brands/osmIds'
import { FeatureId } from './types'

const guesstimateRdfType = (osmUris: string[]) => osmUris.flatMap((osmUri) => {
  const tail = osmUri.replace('https://openstreetmap.org/', osmUri)
  const [element, value] = tail.split('/')
  return [`osm:building:${element}:${value}`, `osm:amenities:${element}:${value}`] as OSMRDFTableElementValue[]
})

export const useExpandedFeatures = (
  features: FeatureId[],
  options?: {
    useFeaturesSWRConfig: SWRInfiniteConfiguration<FetchOneFeatureResult>,
    useOsmToAcSWRConfig: SWRInfiniteConfiguration<FetchOsmToAcFeatureResult>,
    cache?: boolean
  },
) => {
  const initialFeaturesResult = useFeatures(features, options ? { swr: options.useFeaturesSWRConfig, cache: options.cache } : undefined)
  const { data: initialFeatures } = initialFeaturesResult

  const osmFeatureIds = features.filter(isOSMRdfTableElementValue) ?? []
  // eslint-disable-next-line max-len, @stylistic/js/max-len
  const additionalAcFeatureResult = useOsmToAcFeature(osmFeatureIds, options ? { swr: options.useOsmToAcSWRConfig, cache: options.cache } : undefined)

  // eslint-disable-next-line max-len, @stylistic/js/max-len
  const sameAsFeatureIds = initialFeatures?.flatMap((x) => (isPlaceInfo(x) ? guesstimateRdfType(x.properties.sameAs ?? []) : undefined)).filter((y): y is OSMRDFTableElementValue => typeof y === 'string') ?? []
  // eslint-disable-next-line max-len, @stylistic/js/max-len
  const additionalOsmFeaturesResult = useFeatures(sameAsFeatureIds, options ? { swr: options.useFeaturesSWRConfig, cache: options.cache } : undefined)

  return {
    requestedFeatures: initialFeaturesResult,
    additionalAcFeatures: additionalAcFeatureResult,
    additionalOsmFeatures: additionalOsmFeaturesResult,

    isLoading: initialFeaturesResult.isLoading || additionalAcFeatureResult.isLoading || additionalOsmFeaturesResult.isLoading,
    isValidating: initialFeaturesResult.isValidating || additionalAcFeatureResult.isValidating || additionalOsmFeaturesResult.isValidating,
  }
}
