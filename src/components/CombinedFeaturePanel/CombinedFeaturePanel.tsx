import { t } from "ttag";
import { AnyFeature, isOSMFeature } from "../../lib/model/shared/AnyFeature";
import OSMBuildingDetails from "./OSMBuildingDetails";
import FeaturesDebugJSON from "./components/FeaturesDebugJSON";
import PlaceOfInterestDetails from "./type-specific/poi/PlaceOfInterestDetails";
import OSMSidewalkDetails from "./OSMSidewalkDetails";
import { uniqBy } from "lodash";

type Props = {
  features: AnyFeature[];
};

function FeatureSection({ feature }: { feature: AnyFeature }) {
  if (!isOSMFeature(feature)) {
    return null;
  }

  if (feature.properties.building) {
    return <OSMBuildingDetails feature={feature} />;
  }

  if (feature.properties.highway === 'footway') {
    return <OSMSidewalkDetails feature={feature} />;
  }
  // Place of Interest
  // Environment
}

export function CombinedFeaturePanel(props: Props) {
  return (
    <>
      {props.features && props.features[0] && (
        <PlaceOfInterestDetails feature={props.features[0]} />
      )}
      {props.features &&
        props.features.length > 1 &&
        props.features
          .slice(1)
          .map((feature) => <FeatureSection feature={feature} />)
      }
      <FeaturesDebugJSON features={props.features} />
    </>
  );
}
