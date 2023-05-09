import { AnyFeature, isOSMFeature } from "../../../lib/model/shared/AnyFeature";
import { OSMTagPanel } from "./AccessibilitySection/OSMTagPanel";

type Props = {
  feature: AnyFeature;
};

export default function FeatureAccessibility({ feature }: Props) {
  return (
    <>
      {isOSMFeature(feature) && <OSMTagPanel feature={feature} />}
    </>
  );
}
