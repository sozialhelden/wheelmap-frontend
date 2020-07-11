// @flow

import * as React from 'react';

import StyledFrame from './StyledFrame';
import AccessibilityDetailsTree from './AccessibilityDetailsTree';
import AccessibleDescription from './AccessibleDescription';
import AccessibilitySourceDisclaimer from './AccessibilitySourceDisclaimer';
import WheelchairAndToiletAccessibility from './WheelchairAndToiletAccessibility';
import marked from 'marked';

import type { Feature } from '../../../lib/Feature';
import type { YesNoLimitedUnknown } from '../../../lib/Feature';
import type { Category } from '../../../lib/Categories';
import filterAccessibility from '../../../lib/filterAccessibility';
import { isWheelmapFeatureId, isWheelchairAccessible } from '../../../lib/Feature';
import Description from './Description';
import { AppContextConsumer } from '../../../AppContext';

type Props = {
  appToken: string,
  featureId: ?string | number,
  category: ?Category,
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
  const { featureId, feature, toiletsNearby, cluster } = props;
  const properties = feature && feature.properties;
  const isWheelmapFeature = isWheelmapFeatureId(featureId);

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
  const descriptionElement = description ? <Description>{description}</Description> : null;

  if (isWheelmapFeature && !description && isWheelchairAccessible(properties) === 'unknown') {
    return null;
  }

  return (
    <StyledFrame noseOffsetX={cluster ? 67 : undefined}>
      <WheelchairAndToiletAccessibility
        isEditingEnabled={isWheelmapFeature}
        feature={feature}
        toiletsNearby={toiletsNearby}
        onOpenWheelchairAccessibility={props.onOpenWheelchairAccessibility}
        onOpenToiletAccessibility={props.onOpenToiletAccessibility}
        onOpenToiletNearby={props.onOpenToiletNearby}
      />
      {description && descriptionElement}
      <AccessibleDescription properties={properties} />
      {accessibilityDetailsTree}
      <AppContextConsumer>
        {appContext => (
          <AccessibilitySourceDisclaimer
            properties={properties}
            appToken={appContext.app.tokenString}
          />
        )}
      </AppContextConsumer>
    </StyledFrame>
  );
}
