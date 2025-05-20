import { isEqual } from "lodash";
import type { TypeTaggedOSMFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import isAccessibilityRelevantOSMKey from "~/needs-refactoring/lib/model/osm/tag-config/isAccessibilityRelevantOSMKey";
import FeatureNameHeader from "../../components/FeatureNameHeader";
import { useOsmTags } from "~/modules/feature-panel/hooks/useOsmTags";

export default function OSMBuildingDetails({
  feature,
}: { feature: TypeTaggedOSMFeature }) {
  const keys = Object.keys(feature.properties).filter(
    isAccessibilityRelevantOSMKey,
  );

  const { nestedTags } = useOsmTags(feature);
  console.log("feature in building", feature);
  if (keys.length === 0 || isEqual(keys, ["building:levels"])) {
    return null;
  }

  return (
    <>
      {/*<Link href={`/amenities/${feature._id?.replace("/", ":")}`} asChild>*/}
      <FeatureNameHeader feature={feature} size="small" iconSize="medium" />
      {/*</Link>*/}
    </>
  );
}
