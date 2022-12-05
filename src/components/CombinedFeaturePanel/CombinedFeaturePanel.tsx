import { t } from "ttag";
import { AnyFeature } from "../../lib/model/shared/AnyFeature";
import FeaturesDebugJSON from "./components/FeaturesDebugJSON";
import PlaceOfInterestDetails from "./type-specific/poi/PlaceOfInterestDetails";

type Props = {
  features: AnyFeature[];
};

export function CombinedFeaturePanel(props: Props) {
  return (
    <>
      {props.features && props.features[0] && (
        <PlaceOfInterestDetails feature={props.features[0]} />
      )}
      <h2>{t`Environment`}</h2>
      {props.features &&
        props.features.length > 1 &&
        props.features
          .slice(1)
          .map((feature) => <FeaturesDebugJSON features={[feature]} />)}
      ;
    </>
  );
}
