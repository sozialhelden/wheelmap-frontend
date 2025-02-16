import { Box } from "@radix-ui/themes";
import { isEqual } from "lodash";
import type { TypeTaggedOSMFeature } from "../../../../lib/model/geo/AnyFeature";
import isAccessibilityRelevantOSMKey from "../../../../lib/model/osm/tag-config/isAccessibilityRelevantOSMKey";
import FeatureAccessibility from "../../components/AccessibilitySection/FeatureAccessibility";
import FeatureNameHeader from "../../components/FeatureNameHeader";

export default function OSMBuildingDetails({
  feature,
}: { feature: TypeTaggedOSMFeature }) {
  const keys = Object.keys(feature.properties).filter(
    isAccessibilityRelevantOSMKey,
  );
  if (keys.length === 0 || isEqual(keys, ["building:levels"])) {
    return null;
  }

  return (
    <>
      <FeatureNameHeader feature={feature} size="small" />
      <FeatureAccessibility feature={feature} />
    </>
  );
}
