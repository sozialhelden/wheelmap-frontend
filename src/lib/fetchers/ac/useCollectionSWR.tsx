import useSWR, { SWRResponse } from 'swr'
import { Geometry, Point } from 'geojson'
import { useMemo } from 'react'
import ResourceError from '../ResourceError'
import { CollectionName } from './ACCollection'
import { fetchCollectionWithTypeTags } from './fetchCollection'
import useAccessibilityCloudAPI from './useAccessibilityCloudAPI'
import { ListOrFeatureCollection } from './ListOrFeatureCollection'
import { CollectionResultType } from './CollectionResultType'

type Args = {
  collectionName: CollectionName;
  params?: URLSearchParams;
  cached?: boolean;
  shouldRun?: boolean;
}

/**
 * Fetch a collection of documents from the accessibility.cloud API and cache it with SWR.
 *
 * The collection can be a list of documents (wrapped with metadata) or a geometry-typed GeoJSON FeatureCollection.
 *
 * @example ```typescript
 * const { data, error } = useCollectionSWR({
 *   collectionName: 'PlaceInfos',
 *   params: new URLSearchParams({ x: 1, y: 2, z: 3 },
 *   cached: false,
 *   shouldRun: true,
 * });
 * ```
 */

export default function useCollectionSWR<D, R extends CollectionResultType = 'List', G extends Geometry | null = Point>({
  collectionName,
  params,
  cached = true,
  shouldRun = true,
}: Args): SWRResponse<ListOrFeatureCollection<D, R, G>, ResourceError> {
  const { baseUrl, appToken } = useAccessibilityCloudAPI({ cached })
  const paramsWithAppToken = new URLSearchParams(params)
  paramsWithAppToken.append('appToken', appToken)
  const paramsString = paramsWithAppToken.toString()
  const swrConfig = useMemo(() => ({}), [])
  return useSWR<ListOrFeatureCollection<D, R, G>, ResourceError>(
    shouldRun && baseUrl && [baseUrl, collectionName, paramsString],
    fetchCollectionWithTypeTags,
    swrConfig,
  )
}
