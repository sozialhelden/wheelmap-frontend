import { t } from "ttag";
import { TypeTaggedOSMFeature } from "../../lib/model/shared/AnyFeature";
import FeatureNameHeader from "./components/FeatureNameHeader";
import OSMTagTable from "./components/AccessibilitySection/OSMTagTable";
import { OSMTags } from "./components/AccessibilitySection/OSMTags";

export default function OSMSidewalkDetails({ feature }: { feature: TypeTaggedOSMFeature }) {
  return <section>
    <FeatureNameHeader feature={feature} />
    <OSMTags feature={feature} />
  </section>
}