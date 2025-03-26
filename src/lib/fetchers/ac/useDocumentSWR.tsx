import { useMemo } from "react";
import useSWR, { type SWRResponse } from "swr";
import useAccessibilityCloud from "~/modules/accessibility-cloud/hooks/useAccessibilityCloud";
import type {
  AccessibilityCloudRDFType,
  AccessibilityCloudTypeMapping,
} from "../../model/typing/AccessibilityCloudTypeMapping";
import type ResourceError from "../ResourceError";
import { fetchDocumentWithTypeTag } from "./fetchDocument";

type Args<RDFTypeName> = {
  /** The RDF type of the document to fetch {@link AccessibilityCloudRDFType}. */
  type: RDFTypeName;
  /** The ID of the document to fetch. */
  _id: string;
  /** Additional query parameters to include in the request. */
  params?: URLSearchParams;
  /** Whether to use the CDN-cached version of the document. Defaults to `true`.
   * Fetched documents might be out of date, but fetching can be much faster and is robust when
   * many users request the same data at once. Only set this to `false` if seeing up-to-date data
   * is essential for the UX.
   */
  cached?: boolean;
  /** Whether to run the fetcher. Defaults to `true`. */
  shouldRun?: boolean;
};

type ExtraAPIResultFields = {
  related: Record<string, Record<string, unknown>>;
};

/**
 * React hook to fetch a typed single document from the accessibility.cloud API using [SWR](https://swr.vercel.app/).
 * @see https://swr.vercel.app/
 *
 * When it fails, a {@link ResourceError} object is returned.
 *
 * @example This call returns a `MappingEvent` document from accessibility.cloud:
 *
 * ```typescript
 * const { data, error, isLoading } = useDocumentSWR({
 *   type: 'ac:MappingEvent',
 *   _id: 'abc123',
 *   params: new URLSearchParams({ includeXYZ: 'true' },
 *   cached: false,
 * })
 * ```
 */

export default function useDocumentSWR<
  RDFTypeName extends AccessibilityCloudRDFType,
  DataType extends
    AccessibilityCloudTypeMapping[RDFTypeName] = AccessibilityCloudTypeMapping[RDFTypeName],
>({
  type,
  _id,
  params,
  cached = true,
  shouldRun = true,
}: Args<RDFTypeName>): SWRResponse<
  DataType & ExtraAPIResultFields,
  ResourceError
> {
  const { baseUrl, appToken } = useAccessibilityCloud({ cached });
  const paramsWithAppToken = new URLSearchParams(params);
  if (!appToken) {
    throw new Error(
      "Cannot fetch documents from accessibility.cloud without an appToken. Please supply an appToken in the environment.",
    );
  }
  paramsWithAppToken.append("appToken", appToken);
  const paramsString = paramsWithAppToken.toString();
  const swrConfig = useMemo(() => ({}), []);
  const document = useSWR<DataType & ExtraAPIResultFields, ResourceError>(
    shouldRun && baseUrl && type && _id && { baseUrl, type, _id, paramsString },
    fetchDocumentWithTypeTag,
    swrConfig,
  );
  return document;
}
