import type { SWRInfiniteConfiguration } from 'swr/infinite'
import { isAccessibilityCloudId } from '../../typing/discriminators/isAccessibilityCloudId'
import { isOSMRdfTableElementValue } from '../../typing/discriminators/osmDiscriminator'
import {
  type FetchOneFeatureResult, FetchOnePlaceInfoResult, type FetchOsmToAcFeatureResult,
} from './fetchers'
import type { FeatureId } from './types'
import { useFeatures } from './useFeatures'
import { useOsmToAcFeature } from './useOsmToAcFeature'
import { useAcToOsmFeatures } from './useAcToOsmFeatures'
import { AccessibilityCloudRDFId } from '../../typing/brands/accessibilityCloudIds'

/**
 * `useExpandedFeatures` is a hook to load `ac:PlaceInfo` and `osm:Feature` IDs in the order passed of {@link features}.
 * It expects an ordered list of RDF-IDs, loads their data and tries to resolve `osm:Feature`s for `ac:PlaceInfo`s, and
 * `ac:PlaceInfos` for `osm:Feature`s, if any exist.
 */
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

  const feats = initialFeatures
    // eslint-disable-next-line max-len, @stylistic/js/max-len
    .filter((x): x is Omit<FetchOnePlaceInfoResult, 'originId'> & { originId: AccessibilityCloudRDFId } => isAccessibilityCloudId(x.originId) && !!x.feature)
    .map((x) => ({ feature: x.feature, originId: x.originId }))
  const additionalOSMFeaturesResult = useAcToOsmFeatures(feats, { swr: options?.useFeaturesSWRConfig, cache: options?.cache ?? false })

  return {
    /** List of the feature that had been requested */
    requestedFeatures: initialFeaturesResult,
    /** List of AC features that were resolved from initially passed `osm:Feature` IDs */
    additionalAcFeatures: additionalAcFeatureResult,
    /** List of OSM features that were resolved from initially passed `ac:PlaceInfo` IDs */
    additionalOsmFeatures: additionalOSMFeaturesResult,

    /** Indicating that at least one more request is loading */
    isLoading: initialFeaturesResult.isLoading || additionalAcFeatureResult.isLoading || additionalOSMFeaturesResult.isLoading,
    /** Indicating that at least one more request is validating */
    isValidating: initialFeaturesResult.isValidating || additionalAcFeatureResult.isValidating || additionalOSMFeaturesResult.isValidating,
  }
}
