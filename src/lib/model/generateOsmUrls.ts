import { EquipmentInfo, PlaceInfo } from '@sozialhelden/a11yjson';
import { isWheelmapFeatureId } from './Feature';

function getLatLonFromFeature(feature: PlaceInfo | EquipmentInfo) {
  if (
    feature &&
    feature.geometry &&
    feature.geometry.type === 'Point' &&
    feature.geometry.coordinates instanceof Array
  ) {
    return {
      lat: feature.geometry.coordinates[1],
      lon: feature.geometry.coordinates[0],
    };
  }

  throw new Error('Could not extract LatLon from Feature');
}

// aligns edit links for ways vs. nodes in osm
export function generateOsmEditUrl(featureId: number) {
  // see https://wheelmap.uservoice.com/forums/31554-general/suggestions/1149531-support-not-only-openstreetmap-nodes-but-also-sha
  if (featureId < 0) {
    return `https://www.openstreetmap.org/edit?way=${Math.abs(featureId)}`;
  }

  return `https://www.openstreetmap.org/edit?node=${featureId}`;
}

type Coords = { lat: number | undefined; lon: number | undefined };

export function generateOsmNoteUrlForCoords(coords: Coords) {
  if (coords && coords.lat && coords.lon) {
    return `https://www.openstreetmap.org/note/new#map=19/${coords.lat}/${coords.lon}&layers=N`;
  }
  return `https://www.openstreetmap.org/note/new`;
}

export function generateOsmEditorUrlForCoords(coords?: Coords) {
  if (coords && coords.lat && coords.lon) {
    return `https://www.openstreetmap.org/edit#map=19/${coords.lat}/${coords.lon}`;
  }
  return `https://www.openstreetmap.org/edit`;
}

// aligns note links for ways vs. nodes in osm
export function generateOsmNoteUrl(feature: PlaceInfo) {
  if (!feature || !feature.properties) {
    return `https://www.openstreetmap.org/note/new`;
  }

  const coords = getLatLonFromFeature(feature);
  return generateOsmNoteUrlForCoords(coords);
}

export function generateShowOnOsmUrl(feature: PlaceInfo) {
  if (!feature || !feature.properties) {
    return null;
  }

  if (isWheelmapFeatureId(feature._id)) {
    const featureId = Number(feature.id);
    if (featureId < 0) {
      return `https://www.openstreetmap.org/way/${Math.abs(featureId)}`;
    }

    return `https://www.openstreetmap.org/node/${Math.abs(featureId)}`;
  }

  const coords = getLatLonFromFeature(feature);
  return `https://www.openstreetmap.org/#map=19/${coords.lat}/${coords.lon}`;
}
