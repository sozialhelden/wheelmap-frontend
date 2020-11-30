import * as React from 'react';

import StyledFrame from './StyledFrame';
import AccessibilityDetailsTree from './AccessibilityDetailsTree';
import AccessibleDescription from './AccessibleDescription';
import AccessibilitySourceDisclaimer from './AccessibilitySourceDisclaimer';
import WheelchairAndToiletAccessibility from './WheelchairAndToiletAccessibility';

import { Feature, isWheelmapProperties } from '../../../lib/Feature';
import { YesNoLimitedUnknown } from '../../../lib/Feature';
import { Category } from '../../../lib/Categories';
import filterAccessibility from '../../../lib/filterAccessibility';
import { isWheelmapFeatureId, isWheelchairAccessible } from '../../../lib/Feature';
import Description from './Description';
import { AppContextConsumer } from '../../../AppContext';

type Props = {
  featureId: string | number | null,
  category: Category | null,
  cluster: any,
  onSelectWheelchairAccessibility?: (value: YesNoLimitedUnknown) => void,
  onOpenWheelchairAccessibility: () => void,
  onOpenToiletAccessibility: () => void,
  onOpenToiletNearby: (feature: Feature) => void,
  presetStatus: YesNoLimitedUnknown | null,
  feature: Feature | null,
  toiletsNearby: Feature[] | null
};

export default function PlaceAccessibilitySection(props: Props) {
  const { featureId, feature, toiletsNearby, cluster } = props;
  const properties = feature && feature.properties;
  if (!properties) {
    return null;
  }
  const isWheelmapFeature = isWheelmapFeatureId(featureId);

  const accessibilityTree =
    properties && !isWheelmapProperties(properties) && typeof properties.accessibility === 'object' ? properties.accessibility : null;
  const filteredAccessibilityTree = accessibilityTree
    ? filterAccessibility(accessibilityTree)
    : null;
  const accessibilityDetailsTree = filteredAccessibilityTree && (
    <AccessibilityDetailsTree details={filteredAccessibilityTree} isNested={true} />
  );
  let description: string = null;
  if (properties && isWheelmapProperties(properties) && typeof properties.wheelchair_description === 'string') {
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
      <AccessibleDescription properties={properties as any} />
      {accessibilityDetailsTree}
      <AppContextConsumer>
        {appContext => (
          <AccessibilitySourceDisclaimer
            properties={properties as any}
            appToken={appContext.app.tokenString}
          />
        )}
      </AppContextConsumer>
    </StyledFrame>
  );
}
