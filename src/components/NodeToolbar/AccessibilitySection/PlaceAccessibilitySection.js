// @flow

import * as React from 'react';
import styled from 'styled-components';

import StyledFrame from './StyledFrame';
import AccessibilityDetailsTree from './AccessibilityDetailsTree';
import AccessibleDescription from './AccessibleDescription';
import AccessibilitySourceDisclaimer from './AccessibilitySourceDisclaimer';
import WheelchairAndToiletAccessibility from './WheelchairAndToiletAccessibility';

import type { Feature } from '../../../lib/Feature';
import type { YesNoLimitedUnknown } from '../../../lib/Feature';
import type { Category } from '../../../lib/Categories';
import filterAccessibility from '../../../lib/filterAccessibility';
import {
  isWheelmapFeatureId,
  wheelmapFeatureFrom,
  isWheelchairAccessible,
} from '../../../lib/Feature';

type Props = {
  featureId: ?string | number,
  category: ?Category,
  onSelectWheelchairAccessibility: (value: YesNoLimitedUnknown) => void,
  onOpenWheelchairAccessibility: () => void,
  onOpenToiletAccessibility: () => void,
  presetStatus: ?YesNoLimitedUnknown,
  // history: RouterHistory,
  feature: ?Feature,
};

const Description = styled.footer.attrs({ className: 'description' })`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem !important;
`;

export default function PlaceAccessibilitySection(props: Props) {
  const { featureId, feature } = props;
  const properties = feature && feature.properties;
  const wheelmapFeature = wheelmapFeatureFrom(feature);
  const isWheelmapFeature = isWheelmapFeatureId(featureId);
  if (
    wheelmapFeature &&
    wheelmapFeature.properties &&
    isWheelchairAccessible(wheelmapFeature.properties) === 'unknown'
  ) {
    return null;
  }

  const accessibilityTree =
    properties && typeof properties.accessibility === 'object' ? properties.accessibility : null;
  const filteredAccessibilityTree = accessibilityTree
    ? filterAccessibility(accessibilityTree)
    : null;
  const accessibilityDetailsTree = filteredAccessibilityTree && (
    <AccessibilityDetailsTree details={filteredAccessibilityTree} />
  );
  let description: ?string = null;
  if (properties && typeof properties.wheelchair_description === 'string') {
    description = properties.wheelchair_description;
  }
  const descriptionElement = description ? <Description>“{description}”</Description> : null;

  return (
    <StyledFrame>
      <WheelchairAndToiletAccessibility
        isEditingEnabled={isWheelmapFeature}
        feature={feature}
        onOpenWheelchairAccessibility={props.onOpenWheelchairAccessibility}
        onOpenToiletAccessibility={props.onOpenToiletAccessibility}
      />
      {description && descriptionElement}
      <AccessibleDescription properties={properties} />
      {accessibilityDetailsTree}
      <AccessibilitySourceDisclaimer properties={properties} />
    </StyledFrame>
  );
}
