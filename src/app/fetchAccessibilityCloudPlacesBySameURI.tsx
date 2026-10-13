import { Dictionary, groupBy } from 'lodash';
import { AccessibilityCloudFeature } from '../lib/Feature';
import env from '../lib/env';
import customFetch from '../lib/fetch';

export async function fetchAccessibilityCloudPlacesBySameURI(
  appToken: string,
  sameAsURIs: string[]
): Promise<Dictionary<AccessibilityCloudFeature[]>> {
  if (!sameAsURIs?.length) {
    return {};
  }
  const baseUrl = env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL || '';
  const sameAsParam = sameAsURIs.map(encodeURIComponent).join(',');
  const url = `${baseUrl}/place-infos.json?appToken=${appToken}&includePlacesWithoutAccessibility=1&sameAs=${sameAsParam}`;
  const response = await customFetch(url, {});
  if (!response.ok) {
    throw new Error(`Could not load place infos by sameAs URI (status ${response.status}).`);
  }
  const features = (await response.json()).features || [];
  return groupBy(features as AccessibilityCloudFeature[], 'properties.sameAs.0');
}
