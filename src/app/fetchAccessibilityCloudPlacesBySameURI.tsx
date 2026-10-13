import { Dictionary, compact, uniq } from 'lodash';
import { AccessibilityCloudFeature } from '../lib/Feature';
import env from '../lib/env';
import customFetch from '../lib/fetch';
import { getOsmUriVariants, groupPlaceInfosByOsmURI, parseOsmUri } from '../lib/model/osmUri';

/**
 * Fetches accessibility.cloud place infos that reference the given OSM URIs in their `sameAs`
 * property, grouped by OSM URI in the `https://openstreetmap.org/<type>/<id>` spelling.
 */
export async function fetchAccessibilityCloudPlacesBySameURI(
  appToken: string,
  sameAsURIs: string[]
): Promise<Dictionary<AccessibilityCloudFeature[]>> {
  const osmElements = compact((sameAsURIs || []).map(parseOsmUri));
  if (!osmElements.length) {
    return {};
  }
  const baseUrl = env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL || '';
  // Place infos might use any URI spelling, but the API's `sameAs` filter matches exactly
  const sameAsParam = uniq(osmElements.flatMap(getOsmUriVariants)).map(encodeURIComponent).join(',');
  const url = `${baseUrl}/place-infos.json?appToken=${appToken}&includePlacesWithoutAccessibility=1&sameAs=${sameAsParam}`;
  const response = await customFetch(url, {});
  if (!response.ok) {
    throw new Error(`Could not load place infos by sameAs URI (status ${response.status}).`);
  }
  const features = (await response.json()).features || [];
  return groupPlaceInfosByOsmURI(features as AccessibilityCloudFeature[]);
}
