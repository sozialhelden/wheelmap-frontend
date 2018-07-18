// @flow

import * as React from 'react';
import { t } from 'c-3po';

import EditLinks from './EditLinks';
import StyledFrame from './StyledFrame';
import AccessibilityDetails from './AccessibilityDetails';
import AccessibleDescription from './AccessibleDescription';
import AccessibilitySourceDisclaimer from './AccessibilitySourceDisclaimer';
import WheelchairAndToiletAccessibility from './WheelchairAndToiletAccessibility';

import type { Feature } from '../../../lib/Feature';
import type { YesNoLimitedUnknown } from '../../../lib/Feature';
import type { Category } from '../../../lib/Categories';
import { getCategoryId } from '../../../lib/Categories';
import filterAccessibility from '../../../lib/filterAccessibility';
import { isWheelmapFeatureId, wheelmapFeatureFrom } from '../../../lib/Feature';


type Props = {
  featureId: ?string | number,
  category: Category,
  onSelectWheelchairAccessibility: ((value: YesNoLimitedUnknown) => void),
  onOpenWheelchairAccessibility: (() => void),
  onOpenToiletAccessibility: (() => void),
  presetStatus: ?YesNoLimitedUnknown,
  // history: RouterHistory,
  feature: ?Feature,
};


export default function PlaceAccessibilitySection(props: Props) {
  const { featureId, feature } = props;
  const properties = feature && feature.properties;
  const accessibility = properties && typeof properties.accessibility === 'object' ? properties.accessibility : null;
  const filteredAccessibility = accessibility ? filterAccessibility(accessibility) : null;
  const isWheelmapFeature = isWheelmapFeatureId(featureId);
  const editLinks = isWheelmapFeature && <EditLinks {...{ feature, featureId }} />;
  const accessibilityDetails = filteredAccessibility && <AccessibilityDetails details={filteredAccessibility} />;
  let description: ?string = null;
  if (properties && typeof properties.wheelchair_description === 'string') {
    description = properties.wheelchair_description;
  }
  const descriptionElement = description ? <footer className="description">“{description}”</footer> : null;

  return <StyledFrame>
    <WheelchairAndToiletAccessibility
      isEditingEnabled={isWheelmapFeature}
      properties={properties}
      onOpenWheelchairAccessibility={props.onOpenWheelchairAccessibility}
      onOpenToiletAccessibility={props.onOpenToiletAccessibility}
    />
    { description && descriptionElement }
    {editLinks}
    <AccessibleDescription properties={properties} />
    {accessibilityDetails}
    <AccessibilitySourceDisclaimer properties={properties} />
  </StyledFrame>;
}
