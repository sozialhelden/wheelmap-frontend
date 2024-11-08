import { FC } from 'react'
import { AnyFeature, isPlaceInfo } from '../../../../../lib/model/geo/AnyFeature'
import { useFeature } from '../../../../../lib/fetchers/useFeature'
import AccessibilityDetailsTree from './AccessibilityDetailsTree'
import { useCurrentLanguageTagStrings } from '../../../../../lib/context/LanguageTagContext'
import useAccessibilityAttributesIdMap from '../../../../../lib/fetchers/ac/useAccessibilityAttributesIdMap'
import IAccessibilityAttribute from '../../../../../lib/model/ac/IAccessibilityAttribute'

const selectAcAccessibility = (feature: AnyFeature, featureResult: ReturnType<typeof useFeature>) => {
  if (featureResult.accessibilityCloudFeature && featureResult.accessibilityCloudFeature.features.length > 0) {
    const acFeature = featureResult.accessibilityCloudFeature.features[0]
    if (acFeature.properties.accessibility) {
      return acFeature.properties.accessibility
    }
  }

  if (isPlaceInfo(feature)) {
    return feature.properties.accessibility
  }
  return undefined
}

export const AccessibilityItems: FC<{ feature: AnyFeature }> = ({ feature }) => {
  const result = useFeature(feature?._id)
  const acAccessibility = selectAcAccessibility(feature, result) ?? { }

  const languageTags = useCurrentLanguageTagStrings()
  const {
    map,
  } = useAccessibilityAttributesIdMap(languageTags)
  return <AccessibilityDetailsTree accessibilityAttributes={map ?? new Map<string, IAccessibilityAttribute>()} details={acAccessibility} />
}
