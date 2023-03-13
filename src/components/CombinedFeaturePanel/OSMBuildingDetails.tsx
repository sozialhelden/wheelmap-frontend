import { t } from "ttag";
import OSMFeature from "../../lib/model/osm/OSMFeature";
import { TypeTaggedOSMFeature } from "../../lib/model/shared/AnyFeature";
import PlaceWheelchairAndToiletAccessibilitySection from "./components/AccessibilitySection/WheelchairAndToiletAccessibilitySection";
import FeatureContext from "./components/FeatureContext";
import FeaturesDebugJSON from "./components/FeaturesDebugJSON";

export default function OSMBuildingDetails({ feature }: { feature: TypeTaggedOSMFeature }) {
  const houseName = feature.properties['addr:housename'];
  const levels = feature.properties['building:levels'];
  return <section>
    <h2>{houseName ? <p>{houseName}</p> : t`Building`}</h2>
    <dl>
      {levels && <> <dt>{t`Levels`}</dt><dd>{levels}</dd></>}
    </dl>
    <FeatureContext.Provider value={feature}>
      <PlaceWheelchairAndToiletAccessibilitySection showToiletAccessibility={false} />
    </FeatureContext.Provider>
  </section>
}