import { isEqual } from "lodash";
import { t } from "ttag";
import isAccessibilityRelevantOSMKey from "../../lib/model/osm/isAccessibilityRelevantOSMKey";
import { TypeTaggedOSMFeature } from "../../lib/model/shared/AnyFeature";
import FeatureAccessibility from "./components/FeatureAccessibility";
import FeatureNameHeader from "./components/FeatureNameHeader";

export default function OSMBuildingDetails({ feature }: { feature: TypeTaggedOSMFeature }) {
  const keys = Object.keys(feature.properties).filter(isAccessibilityRelevantOSMKey);
  if (keys.length === 0 || isEqual(keys, ['building:levels'])) {
    return null;
  }

  return <section>
    <h4>{t`Probably inside…`}</h4>
    <article>
      <FeatureNameHeader feature={feature} size="small" />
      <FeatureAccessibility feature={feature} />
    </article>
  </section>
}