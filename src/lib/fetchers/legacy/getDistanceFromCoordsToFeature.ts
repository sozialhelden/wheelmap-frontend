import { Feature } from "geojson";
import { normalizedCoordinatesForFeature } from "../../model/ac/normalizedCoordinatesForFeature";
import { geoDistance } from "../../model/geoDistance";

export function getDistanceFromCoordsToFeature(
  coords: [number, number],
  feature: Feature
) {
  const featureCoords = normalizedCoordinatesForFeature(feature);
  if (!featureCoords) {
    return Number.POSITIVE_INFINITY;
  }

  return geoDistance(coords, featureCoords);
}
