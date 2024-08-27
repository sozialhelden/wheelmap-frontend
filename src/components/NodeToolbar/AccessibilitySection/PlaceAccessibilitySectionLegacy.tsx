import * as React from 'react'

import {
  EquipmentInfo,
  PlaceInfo,
  PlaceProperties,
} from '@sozialhelden/a11yjson'
import StyledFrame from './StyledFrame'
import AccessibilityDetailsTree from './AccessibilityDetailsTree'
import AccessibleDescription from './AccessibleDescription'
import AccessibilitySourceDisclaimer from './AccessibilitySourceDisclaimer'
import WheelchairAndToiletAccessibility from './WheelchairAndToiletAccessibility'

import { SourceWithLicense } from '../../../../app/PlaceDetailsProps'
import { isWheelchairAccessible, YesNoLimitedUnknown } from '../../../lib/Feature'
import { Category } from '../../../lib/model/ac/categories/Categories'
import filterAccessibility from '../../../lib/model/ac/filterAccessibility'

import Description from './Description'
import AppContext from '../../../AppContext'
import isA11yEditable from '../AccessibilityEditor/isA11yEditable'
import { useAccessibilityAttributes } from '../../../lib/data-fetching/useAccessibilityAttributes'
import { translatedStringFromObject } from '../../../lib/i18n/translatedStringFromObject'

type Props = {
  featureId: string | string[] | number | null;
  category?: Category | null;
  cluster: any;
  sources: SourceWithLicense[];
  isWheelmapFeature: boolean;
  onSelectWheelchairAccessibility?: (value: YesNoLimitedUnknown) => void;
  onOpenWheelchairAccessibility: () => void;
  onOpenToiletAccessibility: () => void;
  onOpenToiletNearby: (feature: PlaceInfo) => void;
  presetStatus: YesNoLimitedUnknown | null;
  feature: PlaceInfo | EquipmentInfo | null;
  toiletsNearby: PlaceInfo[] | null;
};

export default function PlaceAccessibilitySection(props: Props) {
  const {
    featureId,
    feature,
    toiletsNearby,
    cluster,
    sources,
    isWheelmapFeature,
  } = props

  const appContext = React.useContext(AppContext)
  const properties = feature && feature.properties

  const { data: accessibilityAttributes, error } = useAccessibilityAttributes([
    appContext.preferredLanguage,
  ])
  if (error) {
    throw error
  }

  if (!properties) {
    return null
  }

  const primarySource = sources.length > 0 ? sources[0].source : undefined
  const isEditingEnabled = isA11yEditable(
    featureId,
    appContext.app,
    primarySource,
  )

  const accessibilityTree = accessibilityAttributes
    && properties
    && typeof properties.accessibility === 'object'
    ? properties.accessibility
    : null
  const filteredAccessibilityTree = accessibilityTree
    ? filterAccessibility(accessibilityTree)
    : null
  const accessibilityDetailsTree = filteredAccessibilityTree && (
    <AccessibilityDetailsTree
      details={filteredAccessibilityTree}
      isNested
      accessibilityAttributes={accessibilityAttributes}
    />
  )
  const description: string = translatedStringFromObject(
    accessibilityTree?.description,
  )
  const descriptionElement = description ? (
    <Description>{description}</Description>
  ) : null

  if (
    isWheelmapFeature
    && !description
    && isWheelchairAccessible(properties) === 'unknown'
  ) {
    return null
  }

  return (
    <StyledFrame noseOffsetX={cluster ? 67 : undefined}>
      <WheelchairAndToiletAccessibility />
      {description && descriptionElement}
      <AccessibleDescription properties={properties} />
      {accessibilityDetailsTree}

      {!isWheelmapFeature && (
        <AccessibilitySourceDisclaimer
          properties={properties as PlaceProperties}
          appToken={appContext.app.tokenString}
        />
      )}
    </StyledFrame>
  )
}
