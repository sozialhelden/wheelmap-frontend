import { t } from "@transifex/native";
import { compact, uniq } from "lodash";
import styled from "styled-components";
import type { AnyFeature } from "../../../lib/model/geo/AnyFeature";

export const addressKeys = {
  level: 1,
  street: 1,
  housenumber: 1,
  place: 1,
  postcode: 1,
  city: 1,
  suburb: 1,
  county: 1,
  state: 1,
};

type PartialAddress = Partial<{
  [Property in keyof typeof addressKeys]: string | number;
}>;

type Props = {
  address: PartialAddress;
};

const Address = styled.address`
  font-style: normal;
`;

export default function FeatureAddressString(props: Props) {
  const { address } = props;

  if (!address) {
    return null;
  }

  return (
    <Address>
      {uniq(compact(Object.keys(address).map((key) => address[key]))).join(
        ", ",
      )}
    </Address>
  );
}

export function addressForFeature(feature: AnyFeature) {
  const address: PartialAddress = {};

  if (!feature.properties) {
    return undefined;
  }

  for (const key of Object.keys(addressKeys)) {
    if (feature.properties[key]) {
      address[key] = feature.properties[key];
    }
    if (feature.properties[`addr:${key}`]) {
      address[key] = feature.properties[`addr:${key}`];
    }
  }

  if ("city" in address && "suburb" in address) {
    address.city = `${address.city}-${address.suburb}`;
    address.suburb = undefined;
  }

  if ("postcode" in address && "city" in address) {
    address.city = `${address.city} (${address.postcode})`;
    address.postcode = undefined;
  }

  if ("street" in address && "housenumber" in address) {
    address.street = `${address.street} ${address.housenumber}`;
    address.housenumber = undefined;
  }

  if ("level" in address) {
    const { level } = address;
    if (
      level &&
      (typeof level === "number" || level.match(/^-?\d+(?:[.,;]\d+)*$/))
    ) {
      const levelString =
        typeof level === "string"
          ? level.replace?.(/[,;]/g, "–")
          : String(level);
      address.level = t("Level {levelString}", { levelString });
    }
  }

  if (Object.keys(address).length === 0) {
    return undefined;
  }

  return address;
}
