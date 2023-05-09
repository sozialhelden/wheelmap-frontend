import { Card } from "@blueprintjs/core";
import { isEqual } from "lodash";
import { t } from "ttag";
import isAccessibilityRelevantOSMKey from "../../lib/model/osm/isAccessibilityRelevantOSMKey";
import { TypeTaggedOSMFeature } from "../../lib/model/shared/AnyFeature";
import FeatureAccessibility from "./components/FeatureAccessibility";
import FeatureNameHeader from "./components/FeatureNameHeader";
import WikimediaCommonsImage from "./components/image/WikimediaCommonsImage";

export default function OSMBuildingDetails({ feature }: { feature: TypeTaggedOSMFeature }) {
  const keys = Object.keys(feature.properties).filter(isAccessibilityRelevantOSMKey);
  if (keys.length === 0 || isEqual(keys, ['building:levels'])) {
    return null;
  }

  return <section>
    <p>{t`Probably inside…`}</p>
    <Card>
      <FeatureNameHeader feature={feature} size="small" />
      <FeatureAccessibility feature={feature} compact />
    </Card>
  </section>
}