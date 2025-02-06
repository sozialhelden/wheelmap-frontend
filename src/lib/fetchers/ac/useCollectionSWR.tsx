import type { Geometry, Point } from "geojson";
import useSWR, { type SWRConfiguration, type SWRResponse } from "swr";
import type {
  AccessibilityCloudRDFType,
  AccessibilityCloudTypeMapping,
} from "../../model/typing/AccessibilityCloudTypeMapping";
import type ResourceError from "../ResourceError";
import type { CollectionResultType } from "./CollectionResultType";
import type { ListOrFeatureCollection } from "./ListOrFeatureCollection";
import { fetchCollectionWithTypeTags } from "./fetchCollection";
import useAccessibilityCloudAPI from "./useAccessibilityCloudAPI";

type Args<Type, TConfig extends SWRConfiguration<unknown>> = {
  /** The RDF type of the document to fetch {@link AccessibilityCloudRDFType}. */
  type: Type;
  /** Additional query parameters to include in the request. */
  params?: URLSearchParams;
  /** Whether to fetch a CDN-cached version of the results. Defaults to `true`.
   * Fetched documents might be out of date, but fetching can be much faster and is robust when
   * many users request the same data at once. Only set this to `false` if seeing up-to-date data
   * is essential for the UX.
   */
  cached?: boolean;
  /** Whether to run the fetcher. Defaults to `true`. */
  shouldRun?: boolean;
  /** SWR configuration options. Defaults to `undefined`. */
  options?: TConfig;
};

/**
 * React hook to fetch a typed collection of documents from the accessibility.cloud API using [SWR](https://swr.vercel.app/).
 *
 * When it fails, a {@link ResourceError} object is returned.
 *
 * @returns The document, an error, and a loading state.
 * @see https://swr.vercel.app/
 *
 * @example This call returns a fresh collection of `MappingEvent`s:
 *
 * ```typescript
 * const { data, error, isLoading } = useCollectionSWR({
 *   type: 'ac:MappingEvent',
 *   params: new URLSearchParams({ includeRelated: 'images' }),
 *   cached: false,
 * })
 * ```
 */

export default function useCollectionSWR<
  RDFTypeName extends AccessibilityCloudRDFType,
  DataType extends AccessibilityCloudTypeMapping[RDFTypeName],
  R extends CollectionResultType = "List",
  G extends Geometry | null = Point,
>({
  type,
  params,
  cached = true,
  shouldRun = true,
  options = undefined,
}: Args<
  RDFTypeName,
  SWRConfiguration<ListOrFeatureCollection<DataType, R, G>>
>): SWRResponse<ListOrFeatureCollection<DataType, R, G>, ResourceError> {
  const { baseUrl, appToken } = useAccessibilityCloudAPI({ cached });
  const paramsWithAppToken = new URLSearchParams(params);
  if (appToken) {
    paramsWithAppToken.append("appToken", appToken);
  }
  const paramsString = paramsWithAppToken.toString();
  return useSWR<ListOrFeatureCollection<DataType, R, G>, ResourceError>(
    shouldRun && baseUrl && { baseUrl, type, paramsString },
    fetchCollectionWithTypeTags,
    options,
  );
}
