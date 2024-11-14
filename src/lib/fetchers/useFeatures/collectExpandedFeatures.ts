import { PlaceInfo } from '@sozialhelden/a11yjson'
import { FeatureId } from './types'
import { useExpandedFeatures } from './useExpandedFeatures'
import OSMFeature from '../../model/osm/OSMFeature'
import { TypeTaggedOSMFeature, TypeTaggedPlaceInfo } from '../../model/geo/AnyFeature'

export interface CollectedFeature {
  acFeature?: PlaceInfo,
  osmFeature?: OSMFeature,
  requestedFeature?: PlaceInfo | OSMFeature
}

export const collectExpandedFeaturesResult = (
  featureIds: FeatureId[],
  { requestedFeatures, additionalAcFeatures, additionalOsmFeatures }: ReturnType<typeof useExpandedFeatures>,
) => {
  const featureMap: Partial<Record<FeatureId, CollectedFeature>> = { }
  const featureList: (CollectedFeature | undefined)[] = []

  featureIds.forEach((featureId) => {
    const requestedFeature = requestedFeatures.data?.find((x) => x.id === featureId)
    const additionalAcFeature = additionalAcFeatures.data?.find((x) => x.id === featureId)
    const additionalOsmFeature = additionalOsmFeatures.data?.find((x) => x.id === featureId)

    if (requestedFeature?.['@type'] === 'ac:PlaceInfo') {
      const collected = {
        acFeature: (requestedFeature.feature ?? additionalAcFeature) as TypeTaggedPlaceInfo | undefined,
        osmFeature: additionalOsmFeature?.feature as TypeTaggedOSMFeature | undefined,
        requestedFeature: requestedFeature.feature as (TypeTaggedPlaceInfo | OSMFeature),
      } satisfies CollectedFeature

      featureMap[featureId] = collected
      featureList.push(collected)
      return
    }

    if (requestedFeature?.feature?.['@type'] === 'osm:Feature') {
      const collected = {
        acFeature: additionalAcFeature?.feature as TypeTaggedPlaceInfo | undefined,
        osmFeature: (requestedFeature.feature ?? additionalOsmFeature) as TypeTaggedOSMFeature | undefined,
        requestedFeature: requestedFeature.feature as (TypeTaggedOSMFeature | undefined),
      }

      featureMap[featureId] = collected
      featureList.push(collected)
      return
    }

    featureList.push(undefined)
  })

  return {
    map: featureMap,
    features: featureList,
  }
}
