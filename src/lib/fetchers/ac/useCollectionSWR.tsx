import useSWR, { SWRResponse } from 'swr'
import { Geometry, Point } from 'geojson'
import { useMemo } from 'react'
import ResourceError from '../ResourceError'
import { CollectionName } from './ACCollection'
import { fetchCollectionWithTypeTags } from './fetchCollection'
import useAccessibilityCloudAPI from './useAccessibilityCloudAPI'
import { ListOrFeatureCollection } from './ListOrFeatureCollection'
import { CollectionResultType } from './CollectionResultType'
import { AccessibilityCloudRDFType, AccessibilityCloudTypeMapping } from '../../model/typing/AccessibilityCloudTypeMapping'

type Args<Type> = {
  /** type The RDF type of the document to fetch {@link AccessibilityCloudRDFType}. */
  type: Type;
  /** params Additional query parameters to include in the request. */
  params?: URLSearchParams;
  /** Whether to fetch a CDN-cached version of the results. Defaults to `true`.
   * Fetched documents might be out of date, but fetching can be much faster and is robust when
   * many users request the same data at once. Only set this to `false` if seeing up-to-date data
   * is essential for the UX.
   */
  cached?: boolean;
  /** shouldRun Whether to run the fetcher. Defaults to `true`. */
  shouldRun?: boolean;
}

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
  R extends CollectionResultType = 'List',
  G extends Geometry | null = Point,
>({
  type,
  params,
  cached = true,
  shouldRun = true,
}: Args<RDFTypeName>): SWRResponse<ListOrFeatureCollection<DataType, R, G>, ResourceError> {
  const { baseUrl, appToken } = useAccessibilityCloudAPI({ cached })
  const paramsWithAppToken = new URLSearchParams(params)
  paramsWithAppToken.append('appToken', appToken)
  const paramsString = paramsWithAppToken.toString()
  const swrConfig = useMemo(() => ({}), [])
  return useSWR<ListOrFeatureCollection<DataType, R, G>, ResourceError>(
    shouldRun && baseUrl && { baseUrl, type, paramsString },
    fetchCollectionWithTypeTags,
    swrConfig,
  )
}
