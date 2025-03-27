import type { AnyFeature } from "../geo/AnyFeature";

export function isToiletFeature(feature: AnyFeature) {
  if (feature["@type"] === "a11yjson:PlaceInfo") {
    return feature.properties.category === "toilets";
  }
  if (feature["@type"] === "osm:Feature") {
    // wiki.openstreetmap.org/wiki/Tag:amenity%3Dtoilets
    return (
      feature.properties.amenity === "toilets" ||
      feature.properties.building === "toilets"
    );
  }
  return false;
}
