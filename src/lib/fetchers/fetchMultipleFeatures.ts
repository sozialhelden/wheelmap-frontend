import useSWR from 'swr'
import { useCurrentApp } from '../context/AppContext'
import { AnyFeature } from '../model/geo/AnyFeature'
import { fetchDocumentWithTypeTag } from './ac/fetchDocument'
import { fetchOneOSMFeature } from './osm-api/fetchOneOSMFeature'
import useOSMAPI from './osm-api/useOSMAPI'

function fetchOnePlaceInfo([baseUrl, appToken, _id]: [string, string, string]) {
  return fetchDocumentWithTypeTag({ baseUrl, type: 'ac:PlaceInfo', _id, paramsString: `appToken=${appToken}` })
}

export async function fetchMultipleFeatures([
  appToken,
  baseUrl,
  idsAsString,
]: [string, string, string | undefined]): Promise<AnyFeature[] | undefined> {
  const ids = idsAsString?.split(',') || []
  if (ids.length === 0) {
    return undefined
  }

  const promises = ids.map((id) => {
    if (id.startsWith('ac:')) {
      return fetchOnePlaceInfo([baseUrl, appToken, id.slice(3)])
    }

    return fetchOneOSMFeature([baseUrl, id]).then(
      (feature) => ({
        '@type': 'osm:Feature',
        ...feature,
      } as AnyFeature),
    )
  })

  return Promise.all(promises)
}

export function useMultipleFeatures(ids: string | string[]) {
  const idsAsString = typeof ids === 'string' ? ids : ids.join(',')
  const app = useCurrentApp()
  const appToken = app.tokenString
  const { baseUrl } = useOSMAPI({ cached: false })

  const features = useSWR(
    appToken && baseUrl && idsAsString && [appToken, baseUrl, idsAsString],
    fetchMultipleFeatures,
  )
  return features
}
