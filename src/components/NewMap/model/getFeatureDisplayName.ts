import Feature from "./Feature";

export default function getFeatureDisplayName(feature: Feature) {
  const properties = feature.properties;
  const ownName =
    properties.name ||
    properties.loc_name ||
    properties.description ||
    properties.ref;

  if (ownName) {
    return ownName;
  }
}
