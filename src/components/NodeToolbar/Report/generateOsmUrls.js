// @flow
import type { Feature } from "../../../lib/Feature";
import { isWheelmapFeature } from "../../../lib/Feature";

function getLatLonFromFeature(feature: Feature) {
  if (feature &&
      feature.geometry &&
      feature.geometry.type === 'Point' &&
      feature.geometry.coordinates instanceof Array) {
    return {
      lat: feature.geometry.coordinates[1], 
      lon: feature.geometry.coordinates[0], 
    };
  }
  return {lat: feature.properties.lat, lon: feature.properties.lon};
}


// aligns edit links for ways vs. nodes in osm
export function generateOsmEditUrl(featureId: number) {
  // see https://wheelmap.uservoice.com/forums/31554-general/suggestions/1149531-support-not-only-openstreetmap-nodes-but-also-sha
  if (featureId < 0) {
    return `https://www.openstreetmap.org/edit?way=${Math.abs(featureId)}`;
  }

  return `https://www.openstreetmap.org/edit?node=${featureId}`;
}

// aligns note links for ways vs. nodes in osm
export function generateOsmNoteUrl(feature: Feature) {
  if (!feature || !feature.properties) {
    return `https://www.openstreetmap.org/note/new`;
  }

  const coords = getLatLonFromFeature(feature);
  return `https://www.openstreetmap.org/note/new#map=19/${coords.lat}/${coords.lon}&layers=N`;
}

export function generateShowOnOsmUrl(feature: Feature) {
  if (!feature || !feature.properties) {
    return null;
  }

  if (isWheelmapFeature(feature) && feature.id) {
    const featureId = Number(feature.id);
    if (featureId < 0) {
      return `https://www.openstreetmap.org/way/${Math.abs(featureId)}`;
    }

    return `https://www.openstreetmap.org/node/${Math.abs(featureId)}`;
  }

  const coords = getLatLonFromFeature(feature);
  return `https://www.openstreetmap.org/#map=19/${coords.lat}/${coords.lon}`;
}