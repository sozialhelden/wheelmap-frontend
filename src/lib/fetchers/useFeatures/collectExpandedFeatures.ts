import type { TypeTaggedOSMFeature, TypeTaggedPlaceInfo } from '../../model/geo/AnyFeature'
import type { FeatureId } from './types'
import type { useExpandedFeatures } from './useExpandedFeatures'

export interface CollectedFeature {
  /** The AccessibilityCloud PlaceInfo, if it exists */
  acFeature?: TypeTaggedPlaceInfo,
  /** The OSM info, if it exists */
  osmFeature?: TypeTaggedOSMFeature,
  /** The originally requested feature, may it be either AccessibltyCloud PlaceInfo or OSM Feature */
  requestedFeature?: TypeTaggedPlaceInfo | TypeTaggedOSMFeature
  /** The feature id that was trying to load the features */
  origin: FeatureId
}

/** Collects the results of `useExpandedFeatures` into a more digestible format */
export const collectExpandedFeaturesResult = (
  featureIds: FeatureId[],
  { requestedFeatures, additionalAcFeatures, additionalOsmFeatures }: ReturnType<typeof useExpandedFeatures>,
) => {
  const featureMap: Partial<Record<FeatureId, CollectedFeature>> = { }
  const featureList: (CollectedFeature | undefined)[] = []

  // 14-11-2024: .forEach, because `for ... of` broke name aliasing with webpack
  featureIds.forEach((featureId) => {
    // pulling out the requests
    const requestedFeature = requestedFeatures.data?.find((x) => x.id === featureId)
    const additionalAcFeature = additionalAcFeatures.data?.find((x) => x.id === featureId)
    const additionalOsmFeature = additionalOsmFeatures.data?.find((x) => x.id === featureId)

    // discering between the types makes minimal difference, but is more readable than inlining
    // depending on the requested feature type, additional data may have been loaded from the other endpoints
    if (requestedFeature?.feature?.['@type'] === 'ac:PlaceInfo') {
      const collected = {
        origin: featureId,
        acFeature: (requestedFeature.feature ?? additionalAcFeature) as TypeTaggedPlaceInfo | undefined,
        osmFeature: additionalOsmFeature?.feature as TypeTaggedOSMFeature | undefined,
        requestedFeature: requestedFeature.feature as (TypeTaggedPlaceInfo | TypeTaggedOSMFeature),
      } satisfies CollectedFeature

      featureMap[featureId] = collected
      featureList.push(collected)
      return
    }

    if (requestedFeature?.feature?.['@type'] === 'osm:Feature') {
      const collected = {
        origin: featureId,
        acFeature: additionalAcFeature?.feature as TypeTaggedPlaceInfo | undefined,
        osmFeature: (requestedFeature.feature ?? additionalOsmFeature) as TypeTaggedOSMFeature | undefined,
        requestedFeature: requestedFeature.feature as (TypeTaggedOSMFeature | undefined),
      } satisfies CollectedFeature

      featureMap[featureId] = collected
      featureList.push(collected)
      return
    }

    // if there is no data either way, the list should be kept intact, thus:
    // if you pass [FeatureA, FeatureB, FeatureC]
    // then you should be able to access the list in same order, even if there is no data
    featureList.push(undefined)
  })

  return {
    map: featureMap,
    features: featureList,
  }
}
