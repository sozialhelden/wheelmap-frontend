import { FC, useContext } from 'react'
import { AnyFeature, isPlaceInfo, TypeTaggedPlaceInfo } from '../../../../../lib/model/geo/AnyFeature'
import { useFeature } from '../../../../../lib/fetchers/useFeature'
import AccessibilityDetailsTree from './AccessibilityDetailsTree'
import { useCurrentLanguageTagStrings } from '../../../../../lib/context/LanguageTagContext'
import useAccessibilityAttributesIdMap from '../../../../../lib/fetchers/ac/useAccessibilityAttributesIdMap'
import IAccessibilityAttribute from '../../../../../lib/model/ac/IAccessibilityAttribute'
import { FeaturePanelContext } from '../../../FeaturePanelContext'
import { collectExpandedFeaturesResult, useExpandedFeatures } from '../../../../../lib/fetchers/useManyFeatures'
import { AccessibilityCloudAPIFeatureCollectionResult } from '../../../../../lib/fetchers/ac/AccessibilityCloudAPIFeatureCollectionResult'

const selectAcAccessibility = (feature: AnyFeature, featureResult: {
  id: string,
  primaryFeature?: AnyFeature,
  additionalData?: AccessibilityCloudAPIFeatureCollectionResult<TypeTaggedPlaceInfo>,
}[]) => {
  const result = featureResult[0]
  if (!result) {
    return undefined
  }

  if (result.primaryFeature?.['@type'] === 'ac:PlaceInfo' && result.primaryFeature.properties.accessibility) {
    return result.primaryFeature.properties.accessibility
  }

  return result.additionalData?.features[0].properties.accessibility
}

export const AccessibilityItems: FC<{ feature: AnyFeature }> = ({ feature }) => {
  const context = useContext(FeaturePanelContext)

  // const result = useFeature(feature?._id)
  const acAccessibility = selectAcAccessibility(feature, context.features) ?? { }

  const languageTags = useCurrentLanguageTagStrings()
  const {
    map,
  } = useAccessibilityAttributesIdMap(languageTags)
  return <AccessibilityDetailsTree accessibilityAttributes={map ?? new Map<string, IAccessibilityAttribute>()} details={acAccessibility} />
}
