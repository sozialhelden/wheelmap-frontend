import { t } from "ttag";
import { AnyFeature, isOSMFeature, isSearchResultFeature } from "../../lib/model/shared/AnyFeature";
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

  if (feature.properties.highway === 'footway' || feature.properties.highway === 'pedestrian') {
    return <OSMSidewalkDetails feature={feature} />;
  }
  // Place of Interest
  // Environment
}

export function CombinedFeaturePanel(props: Props) {
  const features = uniqBy(props.features, (feature) => isSearchResultFeature(feature) ? feature.properties.osm_id : feature._id);
  return (
    <>
      {features && features[0] && (
        <PlaceOfInterestDetails feature={features[0]} />
      )}
      {features &&
        features.length > 1 &&
        features
          .slice(1)
          .map((feature) => <FeatureSection feature={feature} />)
      }
      <FeaturesDebugJSON features={features} />
    </>
  );
}
