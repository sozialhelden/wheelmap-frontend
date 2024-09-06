import ResourceError from '../ResourceError'
import { memoizedKebabCase } from '../../util/strings/memoizedKebabCase'
import { AccessibilityCloudTypeMapping } from '../../model/typing/AccessibilityCloudTypeMapping'

/**
 * Fetch a list of documents from the accessibility.cloud API.
 */
export async function fetchCollectionWithTypeTags<C>([
  /** The accessibility.cloud API base URL. There are different endpoints with different caching / CDN configs. */
  baseUrl,
  /** The accessibility.cloud collection to fetch the document from. */
  collectionName,
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
  const kebabName = memoizedKebabCase(collectionName)
  const url = `${baseUrl}/${kebabName}.json${paramsString ? `?${paramsString}` : ''}`
  const response = await fetch(url)
  if (!response.ok) {
    const errorResponse = await response.json()
    const defaultReason = `Failed to fetch ${collectionName} from ${baseUrl} (Params: ${paramsString})`
    throw new ResourceError(errorResponse.reason || defaultReason, errorResponse.details, response.status, response.statusText)
  }
  return response.json()
}
