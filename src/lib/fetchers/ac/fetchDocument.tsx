import { memoizedPluralize } from '../../model/ac/pluralize'
import { AccessibilityCloudTypeMapping } from '../../model/typing/AccessibilityCloudTypeMapping'
import { memoizedKebabCase } from '../../util/strings/memoizedKebabCase'
import ResourceError from '../ResourceError'

/**
 * Fetch a single document from the accessibility.cloud API.
 */
export async function fetchDocumentWithTypeTag<D>([
  /** The accessibility.cloud API base URL. There are different endpoints with different caching / CDN configs. */
  baseUrl,
  /** The accessibility.cloud collection to fetch the document from. */
  rdfType,
  /** Alphanumeric ID of the document to fetch. */
  _id,
  /**
   * URL query string. This is a string so it works as a partial cache key (when used with useSWR).
   * Usually includes an `appToken=...` parameter.
   */
  paramsString,
]: [
  string,
  keyof AccessibilityCloudTypeMapping,
  string,
  string,
]): Promise<D> {
  const nameWithoutPrefix = rdfType.match(/[^:]+:(.*)$/)?.[1]
  if (nameWithoutPrefix === undefined) {
    throw new Error(`Could not extract name from rdfType ${rdfType}`)
  }
  const kebabName = memoizedKebabCase(nameWithoutPrefix)
  const kebabPluralName = memoizedPluralize(kebabName)
  const url = `${baseUrl}/${kebabPluralName}/${_id}.json${paramsString ? `?${paramsString}` : ''}`
  const response = await fetch(url)
  if (!response.ok) {
    const errorResponse = await response.json()
    const defaultReason = `Failed to fetch \`${rdfType}\` with ID \`${_id}\` from \`${url}\`.`
    throw new ResourceError(errorResponse.reason || defaultReason, errorResponse.details, response.status, response.statusText)
  }
  return {
    '@type': rdfType,
    ...await response.json(),
  }
}