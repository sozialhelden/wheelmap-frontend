import { AccessibilityCloudTypeMapping, getAccessibilityCloudCollectionName } from '../../model/typing/AccessibilityCloudTypeMapping';
import ResourceError from '../ResourceError';

/**
 * Fetch a list of documents from the accessibility.cloud API.
 */
export async function fetchCollectionWithTypeTags<C>([
  /** The accessibility.cloud API base URL. There are different endpoints with different caching / CDN configs. */
  baseUrl,
  /** The accessibility.cloud RDF type to fetch the document from, e.g. `"ac:PlaceInfo"`. */
  type,
  /**
   * URL query string. This is a string so it works as a partial cache key (when used with useSWR).
   * Usually includes an `appToken=...` parameter.
   */
  paramsString,
]: [
  string,
  keyof AccessibilityCloudTypeMapping,
  string,
]): Promise<C> {
  const kebabPluralName = getAccessibilityCloudCollectionName(type);
  const url = `${baseUrl}/${kebabPluralName}.json${paramsString ? `?${paramsString}` : ''}`
  const response = await fetch(url)
  if (!response.ok) {
    const errorResponse = await response.json()
    const defaultReason = `Failed to fetch ${type} from ${baseUrl}.`
    throw new ResourceError(errorResponse.reason || defaultReason, errorResponse.details, response.status, response.statusText)
  }
  return response.json()
}
