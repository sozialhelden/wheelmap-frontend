import { AnyFeature, isOSMFeature } from "../../../lib/model/shared/AnyFeature";
import { OSMTags } from "./AccessibilitySection/OSMTags";

type Props = {
  feature: AnyFeature;
};

export default function FeatureAccessibility({ feature }: Props) {
  return (
    <>
      {isOSMFeature(feature) && <OSMTags feature={feature} />}
    </>
  );
}
