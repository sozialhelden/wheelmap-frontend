import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import { useMemo } from 'react'
import { FeatureId } from './types'
import { useEnvContext } from '../../context/EnvContext'
import { useCurrentAppToken } from '../../context/AppContext'
import { getOSMAPI } from '../osm-api/useOSMAPI'
import { getAccessibilityCloudAPI } from '../ac/useAccessibilityCloudAPI'
import { makeFetchUri } from './utils'
import { isOSMId } from '../../typing/discriminators/osmDiscriminator'
import { composeFetchOneFeature, FetchOneFeatureProperties, FetchOneFeatureResult } from './fetchers'

export const useFeatures = (
  features: FeatureId[],
  options?: {
    swr?: SWRInfiniteConfiguration<FetchOneFeatureResult>,
    cache?: boolean
  },
) => {
  const env = useEnvContext()
  const currentAppToken = useCurrentAppToken()

  const { baseUrl: osmBaseUrl, appToken: osmAppToken } = getOSMAPI(env, currentAppToken, options?.cache ?? false)
  const { baseUrl: acBaseUrl, appToken: acAppToken } = getAccessibilityCloudAPI(env, currentAppToken, options?.cache ?? false)

  const [properties, uris] = useMemo(() => {
    // building additional properties, such as the fetcher can add additional attributes
    const fetcherProperties: Record<string, FetchOneFeatureProperties> = { }
    const fetchUris: string[] = []
    for (let i = 0; i < features.length; i += 1) {
      const feature = features[i]
      const isOsmFeature = isOSMId(feature)
      const url = makeFetchUri(feature, {
        acBaseUrl, acAppToken, osmBaseUrl, osmAppToken,
      })

      const property = { typeTag: (isOsmFeature ? 'osm:Feature' : 'ac:PlaceInfo'), url, id: feature } satisfies FetchOneFeatureProperties
      fetcherProperties[url] = property
      fetchUris.push(url)
    }
    return [fetcherProperties, fetchUris] as const
  }, [acAppToken, acBaseUrl, features, osmAppToken, osmBaseUrl])

  const fetchOneFeature = useMemo(() => composeFetchOneFeature(properties), [properties])

  return useSWRInfinite((index) => uris[index], fetchOneFeature, options?.swr)
}
