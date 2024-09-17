import useSWR, { SWRConfiguration } from 'swr'
import { useCurrentApp } from '../context/AppContext'
import { AnyFeature } from '../model/geo/AnyFeature'
import { fetchDocumentWithTypeTag } from './ac/fetchDocument'
import { fetchOneOSMFeature } from './osm-api/fetchOneOSMFeature'
import useOSMAPI from './osm-api/useOSMAPI'

function fetchOnePlaceInfo([baseUrl, appToken, _id]: [string, string, string]) {
  return fetchDocumentWithTypeTag({
    baseUrl, type: 'ac:PlaceInfo', _id, paramsString: `appToken=${appToken}`,
  })
}

export function mapMultipleFeaturePromises(
  appToken: string,
  baseUrl: string,
  idsAsString: string | undefined,
): Promise<AnyFeature>[] {
  const ids = idsAsString?.split(',') || []
  if (ids.length === 0) {
    return []
  }

  return ids.map((id) => {
    if (id.startsWith('ac:')) {
      return fetchOnePlaceInfo([baseUrl, appToken, id.slice(3)]) as Promise<AnyFeature>
    }

    return fetchOneOSMFeature([baseUrl, id]).then(
      (feature) => ({
        '@type': 'osm:Feature',
        ...feature,
      } as AnyFeature),
    )
  })
}

export async function fetchMultipleFeatures([
  appToken,
  baseUrl,
  idsAsString,
]: [string, string, string | undefined]) {
  return Promise.all(mapMultipleFeaturePromises(appToken, baseUrl, idsAsString))
}

export function useMultipleFeatures(ids: string | string[], options?: SWRConfiguration<AnyFeature[]>) {
  const idsAsString = typeof ids === 'string' ? ids : ids.join(',')
  const app = useCurrentApp()
  const appToken = app.tokenString
  const { baseUrl } = useOSMAPI({ cached: false })

  return useSWR(
    appToken && baseUrl && idsAsString && [appToken, baseUrl, idsAsString],
    fetchMultipleFeatures,
    options,
  )
}

export async function fetchMultipleFeaturesOptional([
  appToken,
  baseUrl,
  idsAsString,
]: [string, string, string | undefined]) {
  return Promise.allSettled(mapMultipleFeaturePromises(appToken, baseUrl, idsAsString))
}

export function useMultipleFeaturesOptional(ids: string | string[], options?: SWRConfiguration<PromiseSettledResult<AnyFeature>[]>) {
  const idsAsString = typeof ids === 'string' ? ids : ids.join(',')
  const app = useCurrentApp()
  const appToken = app.tokenString
  const { baseUrl } = useOSMAPI({ cached: false })

  return useSWR(
    appToken && baseUrl && idsAsString && [appToken, baseUrl, idsAsString],
    fetchMultipleFeaturesOptional,
    options,
  )
}
