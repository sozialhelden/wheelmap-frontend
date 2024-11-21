import type { SWRInfiniteConfiguration } from 'swr/infinite'
import { isAccessibilityCloudId } from '../../typing/discriminators/isAccessibilityCloudId'
import { isOSMIdWithTableAndContextName } from '../../typing/discriminators/osmDiscriminator'
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
 * It expects an ordered list of RDF-URIs, loads their data and tries to resolve `osm:Feature`s for `ac:PlaceInfo`s, and
 * `ac:PlaceInfos` for `osm:Feature`s, if any exist.
 *
 * "Expanding" means that you might get back more features than you requested: Features can be
 * **linked** other features (even from other APIs/DBs), and this hook will fetch those linked
 * features as well.
 *
 * At the point this is written, the hook fetches the following features:
 * - The features you requested by their IDs
 * - Additional accessibility.cloud features that have [OSM URIs listed in their `sameAs` property](https://sozialhelden.github.io/a11yjson/faq/#adding-references-to-other-datasets-in-an-a11yjson-data-record) that match the IDs you provided
 * - Additional OpenStreetMap features using all `sameAs` URIs of the accessibility.cloud features
 *   you requested
 *
 * @param featureIds RDF URIs of features to fetch
 * @param options Options to configure CDN usage and the [SWR hook options](https://swr.vercel.app/docs/pagination#parameters)
 *   used internally
 */

>>>>>>> e230e89e (Add wording changes and doc comments)
export const useExpandedFeatures = (
  featureIds: (FeatureId | undefined)[],
  options?: {
    /**
     * [SWR hook options](https://swr.vercel.app/docs/pagination#parameters) used to fetch
     * directly ID-referenced feature results internally.
     */
    useFeaturesSWRConfig: SWRInfiniteConfiguration<FetchOneFeatureResult>,
    /**
     * [SWR hook options](https://swr.vercel.app/docs/pagination#parameters) used to fetch
     * indirect (= additional) feature results internally.
     */
    useOsmToAcSWRConfig: SWRInfiniteConfiguration<FetchOsmToAcFeatureResult>,
    /**
     * Whether to use a CDN as source for the features. Using a CDN speed up data loading
     * significantly, but CDN-based results might be stale (changed in the meantime).
     *
     * Set this value to `true` if you need the most recent data (e.g. to refetch a feature
     * directly after the user edited it and you know that the new data will differ).
     *
     * @default false
     */
    cache?: boolean
  },
) => {
  const initialFeaturesResult = useFeatures(featureIds, options ? { swr: options.useFeaturesSWRConfig, cache: options.cache } : undefined)
  const initialFeatures = initialFeaturesResult.data ?? []

  const osmFeatureIds = featureIds.filter((x) => !!x && isOSMIdWithTableAndContextName(x)) ?? []
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
