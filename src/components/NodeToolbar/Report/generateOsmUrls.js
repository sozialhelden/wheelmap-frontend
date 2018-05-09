// @flow
import type { Feature } from "../../../lib/Feature";

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

  return `https://www.openstreetmap.org/note/new#map=19/${feature.properties.lat}/${feature.properties.lon}&layers=N`;
}