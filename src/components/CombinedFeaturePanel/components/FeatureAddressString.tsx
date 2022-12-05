import intersperse from "intersperse";
import { compact } from "lodash";
import { AnyFeature } from "../../../lib/model/shared/AnyFeature";

export const addressKeys = {
  street: 1,
  housenumber: 1,
  place: 1,
  postcode: 1,
  city: 1,
  suburb: 1,
  county: 1,
  state: 1,
};

type PartialAddress = Partial<
  { [Property in keyof typeof addressKeys]: string }
>;

type Props = {
  address: PartialAddress;
};

export default function FeatureAddressString(props: Props) {
  const { address } = props;

  if (!address) {
    return null;
  }

  return (
    <address>
      {intersperse(
        compact(
          Object.keys(address).map(
            (key) => address[key] && <span key={key}>{address[key]}</span>
          )
        ),
        <span key="">, </span>
      )}
    </address>
  );
}

export function addressForFeature(feature: AnyFeature) {
  const address: PartialAddress = {};

  for (const key of Object.keys(addressKeys)) {
    if (feature.properties[key]) {
      address[key] = feature.properties[key];
    }
    if (feature.properties["addr:" + key]) {
      address[key] = feature.properties["addr:" + key];
    }
  }

  if ("city" in address && "suburb" in address) {
    address.city = `${address.city}-${address.suburb}`;
    delete address.suburb;
  }

  if ("postcode" in address && "city" in address) {
    address.city = `${address.city} (${address.postcode})`;
    delete address.postcode;
  }

  if ("street" in address && "housenumber" in address) {
    address.street = `${address.street} ${address.housenumber}`;
    delete address.housenumber;
  }

  if (Object.keys(address).length === 0) {
    return undefined;
  }

  return address;
}
