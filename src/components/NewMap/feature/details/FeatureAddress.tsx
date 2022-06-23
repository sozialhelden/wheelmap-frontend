import intersperse from "intersperse";
import { compact } from "lodash";
import Feature from "../../../model/Feature";

type Props = {
  feature: Feature;
};

export default function FeatureAddress(props: Props) {
  const { feature } = props;
  const keys = [
    "street",
    "housenumber",
    "place",
    "postcode",
    "city",
    "suburb",
    "county",
    "state",
    "country",
  ];
  return (
    <address>
      {intersperse(
        compact(
          keys
            .map((k) => `addr:${k}`)
            .map(
              (key) =>
                feature.properties[key] && (
                  <span>{feature.properties[key]}</span>
                )
            )
        ),
        <span>, </span>
      )}
    </address>
  );
}
