import { FC, useContext } from 'react'
import { AnyFeature } from '../../../../../lib/model/geo/AnyFeature'
import AccessibilityDetailsTree from './AccessibilityDetailsTree'
import { useCurrentLanguageTagStrings } from '../../../../../lib/context/LanguageTagContext'
import useAccessibilityAttributesIdMap from '../../../../../lib/fetchers/ac/useAccessibilityAttributesIdMap'
import IAccessibilityAttribute from '../../../../../lib/model/ac/IAccessibilityAttribute'
import { FeaturePanelContext } from '../../../FeaturePanelContext'

export const AccessibilityItems: FC<{ feature: AnyFeature }> = ({ }) => {
  const context = useContext(FeaturePanelContext)

  // const result = useFeature(feature?._id)
  const acAccessibility = context.features[0]?.feature?.acFeature?.properties.accessibility ?? { }

  const languageTags = useCurrentLanguageTagStrings()
  const {
    map,
  } = useAccessibilityAttributesIdMap(languageTags)
  return <AccessibilityDetailsTree accessibilityAttributes={map ?? new Map<string, IAccessibilityAttribute>()} details={acAccessibility} />
}
