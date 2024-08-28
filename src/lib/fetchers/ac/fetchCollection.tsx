import { kebabCase } from "lodash";
import AccessibilityCloudError from "./AccessibilityCloudError";
import { memoizedKebapCase } from "../../util/strings/kebapCase";
import { AccessibilityCloudTypeMapping } from "../../model/typing/AccessibilityCloudTypeMapping";

/**
 * Fetch a list of documents from the accessibility.cloud API.
 */
export async function fetchCollectionWithTypeTags<C>(
  /** The accessibility.cloud API base URL. There are different endpoints with different caching / CDN configs. */
  baseUrl: string,
  /** The accessibility.cloud collection to fetch the document from. */
  collectionName: keyof AccessibilityCloudTypeMapping,
  /**
   * URL query string. This is a string so it works as a partial cache key (when used with useSWR).
   * Usually includes an `appToken=...` parameter.
   */
  paramsString: string,
): Promise<C> {
  const kebabName = memoizedKebapCase(collectionName);
  const url = `${baseUrl}/${kebabName}.json${paramsString ? `?${paramsString}` : ''}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorResponse = await response.json();
    const defaultReason = `Failed to fetch ${collectionName} from ${baseUrl} (Params: ${paramsString})`;
    throw new AccessibilityCloudError(errorResponse.reason || defaultReason, errorResponse.details, response.status, response.statusText);
  }
  return await response.json();
}
