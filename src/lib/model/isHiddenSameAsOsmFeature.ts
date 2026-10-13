import { findOsmElementInSameAs } from './osmUri';

type SameAsFeatureProperties = {
  sameAs?: string[] | null;
};

export function hasOsmSameAsURI(properties: SameAsFeatureProperties | null | undefined): boolean {
  return !!findOsmElementInSameAs(properties?.sameAs);
}

// Places that reference an OSM feature (`sameAs`) are shown merged into the OSM feature's marker
// and details panel instead of being shown as separate markers on the map — unless OSM features
// are not shown, or they are the selected place.
export function isHiddenSameAsOsmFeature(
  properties: SameAsFeatureProperties | null | undefined,
  featureId: string | number | null | undefined,
  selectedFeatureId: string | number | null | undefined,
  areOsmFeaturesShown: boolean
): boolean {
  if (!areOsmFeaturesShown || !hasOsmSameAsURI(properties)) return false;
  if (featureId == null || selectedFeatureId == null) return true;
  return String(featureId) !== String(selectedFeatureId);
}
