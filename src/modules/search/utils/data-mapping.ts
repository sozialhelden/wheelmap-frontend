import type { PhotonResultFeature } from "../../../lib/fetchers/fetchPhotonFeatures";

const typeMap = {
  N: "node",
  W: "way",
  R: "relation",
} as const;

export function getOsmType(feature: PhotonResultFeature) {
  return typeMap[feature.properties.osm_type || "N"] || "node";
}

const collectionMap = {
  elevator: "elevators",
  "highway:elevator": "elevators",
  building: "buildings",
  "place:house": "entrances_or_exits",
} as const;

export function getOsmCollection(feature: PhotonResultFeature) {
  const combinedKey = `${feature.properties.osm_key}:${feature.properties.osm_value}`;
  const secondaryKey = `${feature.properties.osm_key}`;

  return (
    collectionMap[combinedKey] || collectionMap[secondaryKey] || "amenities"
  );
}

export function getUrl(feature: PhotonResultFeature) {
  const { osm_key, osm_value, type } = feature.properties;

  // these are places we don't import using the osm sync
  // and thus, don't have a detail page for.
  if (
    (osm_key === "place" && osm_value !== "house") ||
    (osm_key === "historic" && osm_value === "memorial") ||
    (osm_key === "historic" && osm_value === "battlefield") ||
    type === "street"
  ) {
    return undefined;
  }

  return `/${getOsmCollection(feature)}/${getOsmType(feature)}:${feature.properties.osm_id}`;
}

export function getOsmId(feature: PhotonResultFeature) {
  return `osm:${getOsmCollection(feature)}/${getOsmType(feature)}/${feature.properties.osm_id}`;
}
