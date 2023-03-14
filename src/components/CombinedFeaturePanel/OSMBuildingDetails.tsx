import { Card } from "@blueprintjs/core";
import { t } from "ttag";
import { TypeTaggedOSMFeature } from "../../lib/model/shared/AnyFeature";
import PlaceWheelchairAndToiletAccessibilitySection from "./components/AccessibilitySection/WheelchairAndToiletAccessibilitySection";
import FeatureContext from "./components/FeatureContext";
import FeatureNameHeader from "./components/FeatureNameHeader";

export default function OSMBuildingDetails({ feature }: { feature: TypeTaggedOSMFeature }) {
  const houseName = feature.properties['addr:housename'] || feature.properties['name'];
  const levels = feature.properties['building:levels'];
  return <section>
    <p>{t`Probably inside…`}</p>
    <Card>
      <FeatureNameHeader feature={feature} size="small" />
      <FeatureContext.Provider value={feature}>
        <PlaceWheelchairAndToiletAccessibilitySection showToiletAccessibility={false} />
      </FeatureContext.Provider>
    </Card>
  </section>
}