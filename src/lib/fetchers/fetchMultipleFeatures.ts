import useSWR, { SWRConfiguration } from 'swr'
import { AnyFeature } from '../model/geo/AnyFeature'
import { fetchDocumentWithTypeTag } from './ac/fetchDocument'
import { fetchOneOSMFeature } from './osm-api/fetchOneOSMFeature'
import useOSMAPI from './osm-api/useOSMAPI'
import useAccessibilityCloudAPI from './ac/useAccessibilityCloudAPI'

function fetchOnePlaceInfo(baseUrl:string, appToken: string, id: string) {
  return fetchDocumentWithTypeTag({
    baseUrl, type: 'ac:PlaceInfo', _id: id, paramsString: `appToken=${appToken}`,
  })
}

export function mapMultipleFeaturePromises(
  osmBaseUrl: string,
  osmAppToken: string,
  acBaseUrl: string,
  acAppToken: string,
  idsAsString: string | undefined,
): Promise<AnyFeature | null>[] {
  const ids = idsAsString?.split(',') || []
  if (ids.length === 0) {
    return []
  }

  return ids.map(async (id) => {
    if (!id) {
      return null
    }

    if (id.startsWith('ac:')) {
      return await fetchOnePlaceInfo(acBaseUrl, acAppToken, id.slice(3)) as AnyFeature
    }

    const feature = await fetchOneOSMFeature({ baseUrl: osmBaseUrl, appToken: osmAppToken, prefixedId: id })
    return ({
      '@type': 'osm:Feature',
      ...(feature),
    } as AnyFeature)
  })
}

interface FetchParams { osmBaseUrl: string, osmAppToken: string, acBaseUrl: string, acAppToken: string, idsAsString: string }

export async function fetchMultipleFeatures(
  {
    osmBaseUrl, osmAppToken, acBaseUrl, acAppToken, idsAsString,
  }: FetchParams,
) {
  return Promise.all(mapMultipleFeaturePromises(osmBaseUrl, osmAppToken, acBaseUrl, acAppToken, idsAsString))
}

export function useMultipleFeatures(ids: string | string[], options?: SWRConfiguration<AnyFeature[]> & { cached?: boolean }) {
  const { cached = false, ...remainingOptions } = options || { }
  const idsAsString = typeof ids === 'string' ? ids : ids.join(',')

  const { baseUrl: osmBaseUrl, appToken: osmAppToken } = useOSMAPI({ cached })
  const { baseUrl: acBaseUrl, appToken: acAppToken } = useAccessibilityCloudAPI({ cached })
  const params = {
    osmBaseUrl, osmAppToken, acBaseUrl, acAppToken, idsAsString,
  } as FetchParams
  return useSWR(
    params,
    fetchMultipleFeatures,
    remainingOptions,
  )
}

export async function fetchMultipleFeaturesOptional({
  osmBaseUrl, osmAppToken, acBaseUrl, acAppToken, idsAsString,
}: FetchParams) {
  return Promise.allSettled(mapMultipleFeaturePromises(osmBaseUrl, osmAppToken, acBaseUrl, acAppToken, idsAsString))
}

export function useMultipleFeaturesOptional(ids: string | string[], options?: SWRConfiguration<PromiseSettledResult<AnyFeature>[]> & { cached?: boolean }) {
  const { cached = false, ...remainingOptions } = options || { }
  const idsAsString = typeof ids === 'string' ? ids : ids.join(',')

  const { baseUrl: osmBaseUrl, appToken: osmAppToken } = useOSMAPI({ cached })
  const { baseUrl: acBaseUrl, appToken: acAppToken } = useAccessibilityCloudAPI({ cached })

  const params = {
    osmBaseUrl, osmAppToken, acBaseUrl, acAppToken, idsAsString,
  } as FetchParams
  return useSWR(
    params,
    fetchMultipleFeaturesOptional,
    remainingOptions,
  )
}
