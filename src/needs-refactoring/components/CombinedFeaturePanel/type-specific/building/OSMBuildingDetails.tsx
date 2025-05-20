import { t } from "@transifex/native";
import { isEqual } from "lodash";
import type { TypeTaggedOSMFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import isAccessibilityRelevantOSMKey from "~/needs-refactoring/lib/model/osm/tag-config/isAccessibilityRelevantOSMKey";
import FeatureNameHeader from "../../components/FeatureNameHeader";
import { useOsmTags } from "~/modules/feature-panel/hooks/useOsmTags";
import { Heading } from "@radix-ui/themes";

export default function OSMBuildingDetails({
  feature,
}: { feature: TypeTaggedOSMFeature }) {
  const keys = Object.keys(feature.properties).filter(
    isAccessibilityRelevantOSMKey,
  );

  const { nestedTags } = useOsmTags(feature);
  console.log("nestedTags", nestedTags);
  if (keys.length === 0 || isEqual(keys, ["building:levels"])) {
    return null;
  }

  return (
    <>
      <Heading size="2" mb="0.25rem">
        {t("Part of")}
      </Heading>
      <FeatureNameHeader feature={feature} size="small" iconSize="medium" />
    </>
  );
}
