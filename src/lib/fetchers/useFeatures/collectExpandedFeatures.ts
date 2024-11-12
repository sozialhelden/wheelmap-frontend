import { PlaceInfo } from '@sozialhelden/a11yjson'
import { FeatureId } from './types'
import { useExpandedFeatures } from './useExpandedFeatures'
import OSMFeature from '../../model/osm/OSMFeature'

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

    if (requestedFeature?.kind === 'ac') {
      const collected = {
        acFeature: (requestedFeature.feature ?? additionalAcFeature) as PlaceInfo | undefined,
        osmFeature: additionalOsmFeature?.feature as OSMFeature | undefined,
        requestedFeature: requestedFeature.feature as (PlaceInfo | OSMFeature),
      } satisfies CollectedFeature

      featureMap[featureId] = collected
      featureList.push(collected)
      return
    }

    if (requestedFeature?.kind === 'osm') {
      const collected = {
        acFeature: additionalAcFeature?.feature as PlaceInfo | undefined,
        osmFeature: (requestedFeature.feature ?? additionalOsmFeature) as OSMFeature | undefined,
        requestedFeature: requestedFeature.feature as (PlaceInfo | undefined),
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
