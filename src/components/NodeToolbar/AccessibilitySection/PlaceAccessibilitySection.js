// @flow

import * as React from 'react';

import StyledFrame from './StyledFrame';
import AccessibilityDetailsTree from './AccessibilityDetailsTree';
import AccessibleDescription from './AccessibleDescription';
import AccessibilitySourceDisclaimer from './AccessibilitySourceDisclaimer';
import WheelchairAndToiletAccessibility from './WheelchairAndToiletAccessibility';

import { type SourceWithLicense } from '../../../app/PlaceDetailsProps';
import type { Feature } from '../../../lib/Feature';
import type { YesNoLimitedUnknown } from '../../../lib/Feature';
import type { Category } from '../../../lib/Categories';
import filterAccessibility from '../../../lib/filterAccessibility';
import { isWheelmapFeatureId, isWheelchairAccessible } from '../../../lib/Feature';
import Description from './Description';
import AppContext from '../../../AppContext';

type Props = {
  featureId: ?string | number,
  category: ?Category,
  sources: SourceWithLicense[],
  cluster: ?any,
  onSelectWheelchairAccessibility: (value: YesNoLimitedUnknown) => void,
  onOpenWheelchairAccessibility: () => void,
  onOpenToiletAccessibility: () => void,
  onOpenToiletNearby: (feature: Feature) => void,
  presetStatus: ?YesNoLimitedUnknown,
  feature: ?Feature,
  toiletsNearby: ?(Feature[]),
};

export default function PlaceAccessibilitySection(props: Props) {
  const { featureId, feature, toiletsNearby, isLoadingToiletsNearby, cluster, sources } = props;

  const appContext = React.useContext(AppContext);

  const properties = feature && feature.properties;
  if (!properties) {
    return null;
  }
  const isWheelmapFeature = isWheelmapFeatureId(featureId);
  const primarySource = sources[0];
  const isDefaultSourceForPlaceEditing = primarySource
    ? appContext.app.defaultSourceIdForAddedPlaces === primarySource.source._id
    : false;
  const isA11yRatingAllowed = primarySource
    ? primarySource.source.isA11yRatingAllowed === true
    : false;
  const isEditingEnabled =
    isWheelmapFeature || isDefaultSourceForPlaceEditing || isA11yRatingAllowed;
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
      {accessibilityDetailsTree}
      <AccessibilitySourceDisclaimer
        properties={properties}
        appToken={appContext.app.tokenString}
      />
    </StyledFrame>
  );
}
