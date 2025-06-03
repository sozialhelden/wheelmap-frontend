import { t } from "@transifex/native";
import type { TypeTaggedOSMFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import isAccessibilityRelevantOSMKey from "~/needs-refactoring/lib/model/osm/tag-config/isAccessibilityRelevantOSMKey";
import { OSMTagPanel } from "../../components/AccessibilitySection/OSMTagPanel";
import { Heading } from "@radix-ui/themes";

export default function OSMSidewalkDetails({
  feature,
}: { feature: TypeTaggedOSMFeature }) {
  const keys = Object.keys(feature.properties).filter(
    isAccessibilityRelevantOSMKey,
  );
  if (keys.length === 0) {
    return null;
  }

  return (
    <section>
      <Heading size="2" mb="1">
        {t("Sidewalks and Surroundings")}
      </Heading>
      <OSMTagPanel feature={feature} />
    </section>
  );
}
