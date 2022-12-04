import { AnyFeature } from "./AnyFeature";

function getLatLonFromFeature(
  feature: AnyFeature
): { lat: number; lon: number } {
  if (
    feature &&
    feature.geometry &&
    feature.geometry.type === "Point" &&
    feature.geometry.coordinates instanceof Array
  ) {
    return {
      lat: feature.geometry.coordinates[1],
      lon: feature.geometry.coordinates[0],
    };
  }

  throw new Error("Could not extract LatLon from Feature");
}

type MaybeLatLon = { lat: number | undefined; lon: number | undefined };

export function generateOsmNoteUrlForCoords(coords: MaybeLatLon) {
  if (coords && coords.lat && coords.lon) {
    return `https://www.openstreetmap.org/note/new#map=19/${coords.lat}/${coords.lon}&layers=N`;
  }
  return `https://www.openstreetmap.org/note/new`;
}

export function generateOsmEditorUrlForCoords(coords?: MaybeLatLon) {
  if (coords && coords.lat && coords.lon) {
    return `https://www.openstreetmap.org/edit#map=19/${coords.lat}/${coords.lon}`;
  }
  return `https://www.openstreetmap.org/edit`;
}

// aligns note links for ways vs. nodes in osm
export function generateOsmNoteUrl(feature: AnyFeature) {
  if (!feature || !feature.properties) {
    return `https://www.openstreetmap.org/note/new`;
  }

  const coords = getLatLonFromFeature(feature);
  return generateOsmNoteUrlForCoords(coords);
}

export function generateShowOnOsmUrl(feature: AnyFeature) {
  if (!feature || !feature.properties) {
    return null;
  }

  if (feature["@type"] === "osm:Feature") {
    const featureId = Number(feature.properties._id);
    if (featureId < 0) {
      return `https://www.openstreetmap.org/way/${Math.abs(featureId)}`;
    }

    return `https://www.openstreetmap.org/node/${Math.abs(featureId)}`;
  }

  if (feature["@type"] === "a11yjson:PlaceInfo") {
    const sameAs = feature.properties.sameAs;
    const osmUrl = sameAs.find((url: string) =>
      url.startsWith("https://www.openstreetmap.org/")
    );
    if (osmUrl) {
      return osmUrl;
    }
  }

  const coords = getLatLonFromFeature(feature);
  return `https://www.openstreetmap.org/#map=19/${coords.lat}/${coords.lon}`;
}
