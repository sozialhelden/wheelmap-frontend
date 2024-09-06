import useSWR, { SWRResponse } from 'swr'
import { useMemo } from 'react'
import ResourceError from '../ResourceError'
import { CollectionName } from './ACCollection'
import { fetchDocumentWithTypeTag } from './fetchDocument'
import useAccessibilityCloudAPI from './useAccessibilityCloudAPI'

type Args = {
  collectionName: CollectionName;
  _id: string;
  params?: URLSearchParams;
  cached?: boolean;
  shouldRun?: boolean;
}

/**
 * Fetch a single document from the accessibility.cloud API and cache it with SWR.
 *
 * @example const { data, error } = useDocumentSWR({
 *   collectionName: 'PlaceInfos',
 *   _id: 'abc123',
 *   params: new URLSearchParams({ includeXYZ: 'true' },
 * })
 */

type ExtraAPIResultFields = {
  related: Record<string, Record<string, unknown>>;
}

export default function useDocumentSWR<D>({
  collectionName,
  _id,
  params,
  cached = true,
  shouldRun = true,
}: Args): SWRResponse<D & ExtraAPIResultFields, ResourceError> {
  const { baseUrl, appToken } = useAccessibilityCloudAPI({ cached })
  const paramsWithAppToken = new URLSearchParams(params)
  paramsWithAppToken.append('appToken', appToken)
  const paramsString = paramsWithAppToken.toString()
  const swrConfig = useMemo(() => ({}), [])
  const document = useSWR<D & ExtraAPIResultFields, ResourceError>(
    shouldRun && baseUrl && _id && [baseUrl, collectionName, _id, paramsString],
    fetchDocumentWithTypeTag,
    swrConfig,
  )
  return document
}
