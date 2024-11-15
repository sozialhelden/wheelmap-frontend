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
    requestedFeatures: initialFeaturesResult,
    additionalAcFeatures: additionalAcFeatureResult,
    additionalOsmFeatures: additionalOSMFeaturesResult,

    isLoading: initialFeaturesResult.isLoading || additionalAcFeatureResult.isLoading || additionalOSMFeaturesResult.isLoading,
    isValidating: initialFeaturesResult.isValidating || additionalAcFeatureResult.isValidating || additionalOSMFeaturesResult.isValidating,
  }
}
