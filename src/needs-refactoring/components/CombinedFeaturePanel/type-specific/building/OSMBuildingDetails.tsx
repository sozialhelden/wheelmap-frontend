import { isEqual } from "lodash";
import type { TypeTaggedOSMFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import isAccessibilityRelevantOSMKey from "~/needs-refactoring/lib/model/osm/tag-config/isAccessibilityRelevantOSMKey";
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
      <FeatureNameHeader feature={feature} size="small" iconSize="medium" />
    </>
  );
}
