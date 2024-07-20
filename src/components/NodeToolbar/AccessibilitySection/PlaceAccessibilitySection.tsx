import * as React from "react";

import EditFormSubmissionButton from "../AccessibilityEditor/EditFormSubmissionButton";
import AccessibilityDetailsTree from "./AccessibilityDetailsTree";
import AccessibilitySourceDisclaimer from "./AccessibilitySourceDisclaimer";
import AccessibleDescription from "./AccessibleDescription";
import StyledFrame from "./StyledFrame";
import WheelchairAndToiletAccessibility from "./WheelchairAndToiletAccessibility";

import { SourceWithLicense } from "../../../app/PlaceDetailsProps";
import { Category } from "../../../lib/Categories";
import { AccessibilityCloudProperties, Feature, isWheelchairAccessible, isWheelmapFeature, isWheelmapProperties, YesNoLimitedUnknown } from "../../../lib/Feature";
import filterAccessibility from "../../../lib/filterAccessibility";

import AppContext from "../../../AppContext";
import { useAccessibilityAttributes } from "../../../lib/data-fetching/useAccessibilityAttributes";
import { hasDefaultOSMDescription } from "../../../lib/model/hasDefaultOSMDescription";
import isA11yEditable from "../../../lib/model/isA11yEditable";
import Description from "./Description";

type Props = {
  featureId: string | number | null;
  category: Category | null;
  cluster: any;
  sources: SourceWithLicense[];
  isWheelmapFeature: boolean;
  onSelectWheelchairAccessibility?: (value: YesNoLimitedUnknown) => void;
  onOpenWheelchairAccessibility: () => void;
  onOpenToiletAccessibility: () => void;
  onOpenToiletNearby: (feature: Feature) => void;
  presetStatus: YesNoLimitedUnknown | null;
  feature: Feature | null;
  toiletsNearby: Feature[] | null;
  children?: React.ReactNode;
};

export default function PlaceAccessibilitySection(props: Props) {
  const { featureId, feature, toiletsNearby, cluster, sources, children } = props;

  const appContext = React.useContext(AppContext);
  const properties = feature && feature.properties;

  const { data: accessibilityAttributes, error } = useAccessibilityAttributes([appContext.preferredLanguage]);
  if (error) {
    throw error;
  }

  if (!properties) {
    return null;
  }

  const primarySource = sources.length > 0 ? sources[0].source : undefined;
  const isEditingEnabled = isA11yEditable(feature, appContext.app, primarySource);

  const accessibilityTree = accessibilityAttributes && properties && !isWheelmapProperties(properties) && typeof properties.accessibility === "object" ? properties.accessibility : null;
  const filteredAccessibilityTree = accessibilityTree ? filterAccessibility(accessibilityTree) : null;
  const accessibilityDetailsTree = filteredAccessibilityTree && <AccessibilityDetailsTree details={filteredAccessibilityTree} isNested={true} accessibilityAttributes={accessibilityAttributes} />;
  let description: string = null;
  if (properties && isWheelmapProperties(properties) && typeof properties.wheelchair_description === "string") {
    description = properties.wheelchair_description;
  }
  const descriptionElement = description ? <Description>{description}</Description> : null;

  if (isWheelmapFeature(feature) && !description && isWheelchairAccessible(properties) === "unknown") {
    return null;
  }

  const showDefaultDescription = isWheelmapFeature(feature) && hasDefaultOSMDescription(feature);

  return (
    <StyledFrame noseOffsetX={cluster ? 67 : undefined}>
      <WheelchairAndToiletAccessibility isEditingEnabled={isEditingEnabled} feature={feature} toiletsNearby={toiletsNearby} onOpenWheelchairAccessibility={props.onOpenWheelchairAccessibility} onOpenToiletAccessibility={props.onOpenToiletAccessibility} onOpenToiletNearby={props.onOpenToiletNearby} showDescription={showDefaultDescription} />
      {description && descriptionElement}
      <AccessibleDescription properties={properties} />
      <EditFormSubmissionButton featureId={featureId} feature={feature} sources={sources} />
      {children}
      {accessibilityDetailsTree}
      {!isWheelmapFeature && <AccessibilitySourceDisclaimer properties={properties as AccessibilityCloudProperties} appToken={appContext.app.tokenString} />}
    </StyledFrame>
  );
}
