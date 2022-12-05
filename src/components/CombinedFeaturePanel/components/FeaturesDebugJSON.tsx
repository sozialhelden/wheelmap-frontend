import { omit } from "lodash";
import { AnyFeature } from "../../lib/model/shared/AnyFeature";

export default function FeaturesDebugJSON(props: { features: AnyFeature[] }) {
  return (
    <pre>
      {JSON.stringify(
        props.features.map((f) =>
          omit(f, "geometry.coordinates", "centroid", "type")
        ),
        null,
        2
      )}
    </pre>
  );
}
