import { t } from "ttag";
import type { TypeTaggedOSMFeature } from "../../../../lib/model/geo/AnyFeature";
import isAccessibilityRelevantOSMKey from "../../../../lib/model/osm/tag-config/isAccessibilityRelevantOSMKey";
import { OSMTagPanel } from "../../components/AccessibilitySection/OSMTagPanel";

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
      <h4>{t`Sidewalks & Surroundings`}</h4>
      <OSMTagPanel feature={feature} />
    </section>
  );
}
