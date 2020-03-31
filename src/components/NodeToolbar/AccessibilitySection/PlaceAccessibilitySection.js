// @flow

import * as React from 'react';

import StyledFrame from './StyledFrame';
import AccessibilityDetailsTree from './AccessibilityDetailsTree';
import AccessibleDescription from './AccessibleDescription';
import EditFormSubmissionButton from '../AccessibilityEditor/EditFormSubmissionButton';
import AccessibilitySourceDisclaimer from './AccessibilitySourceDisclaimer';
import WheelchairAndToiletAccessibility from './WheelchairAndToiletAccessibility';

import { type SourceWithLicense } from '../../../app/PlaceDetailsProps';
import type { Feature } from '../../../lib/Feature';
import type { YesNoLimitedUnknown } from '../../../lib/Feature';
import type { Category } from '../../../lib/Categories';
import filterAccessibility from '../../../lib/filterAccessibility';

import Description from './Description';
import AppContext from '../../../AppContext';
import isA11yEditable from '../AccessibilityEditor/isA11yEditable';

type Props = {
  featureId: ?string | number,
  category: ?Category,
  sources: SourceWithLicense[],
  cluster: ?any,
  isWheelmapFeature: boolean,
  onSelectWheelchairAccessibility: (value: YesNoLimitedUnknown) => void,
  onOpenWheelchairAccessibility: () => void,
  onOpenToiletAccessibility: () => void,
  onOpenToiletNearby: (feature: Feature) => void,
  presetStatus: ?YesNoLimitedUnknown,
  feature: ?Feature,
  toiletsNearby: ?(Feature[]),
};

export default function PlaceAccessibilitySection(props: Props) {
  const {
    featureId,
    feature,
    toiletsNearby,
    isLoadingToiletsNearby,
    cluster,
    sources,
    isWheelmapFeature,
  } = props;

  const appContext = React.useContext(AppContext);
  const properties = feature && feature.properties;

  if (!properties) {
    return null;
  }

  const primarySource = sources.length > 0 ? sources[0].source : undefined;
  const isEditingEnabled = isA11yEditable(featureId, appContext.app, primarySource);

  const accessibilityTree =
    properties && typeof properties.accessibility === 'object' ? properties.accessibility : null;
  const filteredAccessibilityTree = accessibilityTree
    ? filterAccessibility(accessibilityTree)
    : null;
  const accessibilityDetailsTree = filteredAccessibilityTree && (
    <AccessibilityDetailsTree details={filteredAccessibilityTree} isNested={true} />
  );
  let description: ?string = null;
  if (properties && typeof properties.wheelchair_description === 'string') {
    description = properties.wheelchair_description;
  }
  const descriptionElement = description ? <Description>{description}</Description> : null;

  if (isWheelmapFeature && !description && isWheelchairAccessible(properties) === 'unknown') {
    return null;
  }

  return (
    <StyledFrame noseOffsetX={cluster ? 67 : undefined}>
      <WheelchairAndToiletAccessibility
        isEditingEnabled={isEditingEnabled}
        feature={feature}
        toiletsNearby={toiletsNearby}
        onOpenWheelchairAccessibility={props.onOpenWheelchairAccessibility}
        onOpenToiletAccessibility={props.onOpenToiletAccessibility}
        onOpenToiletNearby={props.onOpenToiletNearby}
      />
      {description && descriptionElement}
      <AccessibleDescription properties={properties} />
      <EditFormSubmissionButton featureId={featureId} feature={feature} sources={sources} />
      {accessibilityDetailsTree}
      <AccessibilitySourceDisclaimer
        properties={properties}
        appToken={appContext.app.tokenString}
      />
    </StyledFrame>
  );
}
