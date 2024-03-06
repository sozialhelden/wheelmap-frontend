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
  const url = `${baseUrl}/place-infos.json?appToken=${appToken}&includePlacesWithoutAccessibility=1&sameAs=${sameAsURIs.join(',')}`;
  console.log(url);
  const response = await customFetch(url, {});
  const features = (await response.json()).features;
  return groupBy(features as AccessibilityCloudFeature[], 'properties.sameAs.0');
}
