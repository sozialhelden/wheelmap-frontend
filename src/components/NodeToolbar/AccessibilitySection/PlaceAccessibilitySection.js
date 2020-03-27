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
import Description from './Description';
import AppContext from '../../../AppContext';
import isA11yEditable from '../AccessibilityEditor/isA11yEditable';

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
  isLoadingToiletsNearby: boolean,
};

export default function PlaceAccessibilitySection(props: Props) {
  const { featureId, feature, toiletsNearby, isLoadingToiletsNearby, cluster, sources } = props;

  const appContext = React.useContext(AppContext);
  const primarySource = sources.length > 0 ? sources[0].source : undefined;
  const isEditingEnabled = isA11yEditable(featureId, appContext.app, primarySource);

  const properties = feature && feature.properties;
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

  return (
    <StyledFrame noseOffsetX={cluster ? 67 : undefined}>
      <WheelchairAndToiletAccessibility
        isEditingEnabled={isEditingEnabled}
        feature={feature}
        toiletsNearby={toiletsNearby}
        isLoadingToiletsNearby={isLoadingToiletsNearby}
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
