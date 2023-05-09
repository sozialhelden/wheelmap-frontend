import { t } from "ttag";
import { TypeTaggedOSMFeature } from "../../lib/model/shared/AnyFeature";
import FeatureNameHeader from "./components/FeatureNameHeader";
import OSMTagTable from "./components/AccessibilitySection/OSMTagTable";
import { OSMTagPanel } from "./components/AccessibilitySection/OSMTagPanel";
import isAccessibilityRelevantOSMKey from "../../lib/model/osm/isAccessibilityRelevantOSMKey";
import { isEqual } from "lodash";

export default function OSMSidewalkDetails({ feature }: { feature: TypeTaggedOSMFeature }) {
  const keys = Object.keys(feature.properties).filter(isAccessibilityRelevantOSMKey);
  if (keys.length === 0) {
    return null;
  }

  return <section>
    <h4>{t`Sidewalks & Surroundings`}</h4>
    <OSMTagPanel feature={feature} />
  </section>
}