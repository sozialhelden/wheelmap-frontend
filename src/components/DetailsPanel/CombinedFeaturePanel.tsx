import { AnyFeature } from "../../lib/model/shared/AnyFeature";
import FeatureNameHeader from "./FeatureNameHeader";

type Props = {
  features: AnyFeature[];
};

export function CombinedFeaturePanel(props: Props) {
  return (
    <>
      {props.features && props.features[0] && (
        <FeatureNameHeader feature={props.features[0]} />
      )}
      <pre>{JSON.stringify(props.features, null, 2)}</pre>;
    </>
  );
}
