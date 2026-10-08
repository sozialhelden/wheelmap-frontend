type ChildFeatureProperties = {
  parentPlaceInfoId?: string | null;
};

// Places inside another place (`parentPlaceInfoId`) are listed in their parent's details panel
// instead of being shown as separate markers on the map — unless they are the selected place.
export function isHiddenChildFeature(
  properties: ChildFeatureProperties | null | undefined,
  featureId: string | number | null | undefined,
  selectedFeatureId: string | number | null | undefined
): boolean {
  if (!properties?.parentPlaceInfoId) return false;
  if (featureId == null || selectedFeatureId == null) return true;
  return String(featureId) !== String(selectedFeatureId);
}
