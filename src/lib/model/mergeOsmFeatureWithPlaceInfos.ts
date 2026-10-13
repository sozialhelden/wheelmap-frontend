import omit from 'lodash/omit';
import pickBy from 'lodash/pickBy';
import sortBy from 'lodash/sortBy';
import {
  AccessibilityCloudFeature,
  AccessibilityCloudProperties,
  WheelmapFeature,
  hasAccessibleToilet,
  isWheelchairAccessible,
} from '../Feature';

// Properties that define the identity / type of the OSM feature and must not be replaced, so
// that routing, editing and OSM links keep working on the merged feature.
const osmIdentityProperties = ['_id', 'category', 'parentCategoryIds', 'sameAs'];

export function osmSameAsURIForFeature(osmType: string, osmId: string | number): string {
  return `https://openstreetmap.org/${osmType}/${Math.abs(Number(osmId))}`;
}

function overridesFromPlaceInfo(properties: AccessibilityCloudProperties) {
  const wheelchair = isWheelchairAccessible(properties);
  const wheelchairToilet = hasAccessibleToilet(properties);

  const overrides = {
    ...omit(properties, osmIdentityProperties),
    // Map accessibility.cloud fields to their OSM/Wheelmap equivalents so that components
    // reading Wheelmap properties show the place info's values.
    node_type: properties.category ? { id: null, identifier: properties.category } : undefined,
    wheelchair: wheelchair !== 'unknown' ? wheelchair : undefined,
    wheelchair_toilet: wheelchairToilet !== 'unknown' ? wheelchairToilet : undefined,
    phone: properties.phoneNumber || properties.phone,
    website: properties.placeWebsiteUrl,
  };

  // Only values the place info actually has override OSM values.
  return pickBy(overrides, value => value !== null && typeof value !== 'undefined');
}

/**
 * Merges accessibility.cloud place infos that reference an OSM feature via `sameAs` into the
 * OSM feature. Place info values always override OSM values. If there are multiple place infos,
 * the most recently updated one wins.
 */
export function mergeOsmFeatureWithPlaceInfos(
  osmFeature: WheelmapFeature,
  placeInfos: AccessibilityCloudFeature[]
): WheelmapFeature {
  if (!osmFeature || !osmFeature.properties || !placeInfos || placeInfos.length === 0) {
    return osmFeature;
  }

  const placeInfosByAscendingUpdate = sortBy(
    placeInfos.filter(placeInfo => placeInfo && placeInfo.properties),
    placeInfo => placeInfo.properties.lastUpdate || ''
  );

  const properties = placeInfosByAscendingUpdate.reduce(
    (merged, placeInfo) => ({ ...merged, ...overridesFromPlaceInfo(placeInfo.properties) }),
    osmFeature.properties
  );

  return { ...osmFeature, properties };
}
