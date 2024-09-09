import { AccessibilityCloudRDFType, AccessibilityCloudTypeMapping, getAccessibilityCloudCollectionName } from '../../model/typing/AccessibilityCloudTypeMapping';
import ResourceError from '../ResourceError';

type Params<RDFTypeName extends AccessibilityCloudRDFType> = {
  /** The accessibility.cloud API base URL. There are different endpoints with different caching / CDN configs. */
  baseUrl: string,
  /** The accessibility.cloud collection to fetch the document from. */
  type: RDFTypeName,
  /** Alphanumeric ID of the document to fetch. */
  _id: string,
  /**
   * URL query string. This is a string so it works as a partial cache key (when used with useSWR).
   * Usually includes an `appToken=...` parameter.
   */
  paramsString: string,
}
/**
 * Fetch a single document from the accessibility.cloud API.
 */
export async function fetchDocumentWithTypeTag<RDFTypeName extends AccessibilityCloudRDFType, DataType extends AccessibilityCloudTypeMapping[RDFTypeName],>({
  /** The accessibility.cloud API base URL. There are different endpoints with different caching / CDN configs. */
  baseUrl,
  /** The accessibility.cloud collection to fetch the document from. */
  type,
  /** Alphanumeric ID of the document to fetch. */
  _id,
  /**
   * URL query string. This is a string so it works as a partial cache key (when used with useSWR).
   * Usually includes an `appToken=...` parameter.
   */
  paramsString,
}: Params<RDFTypeName>): Promise<DataType> {
  const kebabPluralName = getAccessibilityCloudCollectionName(type);
  const url = `${baseUrl}/${kebabPluralName}/${_id}.json${paramsString ? `?${paramsString}` : ''}`
  const response = await fetch(url)
  if (!response.ok) {
    const errorResponse = await response.json()
    const defaultReason = `Failed to fetch \`${type}\` with ID \`${_id}\` from \`${url}\`.`
    throw new ResourceError(errorResponse.reason || defaultReason, errorResponse.details, response.status, response.statusText)
  }
  return {
    '@type': type,
    ...await response.json(),
  }
}
