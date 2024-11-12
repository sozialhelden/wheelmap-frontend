import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import { FeatureId } from './types'
import { useEnvContext } from '../../context/EnvContext'
import { useCurrentAppToken } from '../../context/AppContext'
import { getOSMAPI } from '../osm-api/useOSMAPI'
import { getAccessibilityCloudAPI } from '../ac/useAccessibilityCloudAPI'
import { makeFetchUri } from './utils'
import { isOSMId } from '../../typing/discriminators/osmDiscriminator'
import { composeFetchOneFeature, FetchOneFeatureProperties, FetchOneFeatureTransformedResult } from './fetchers'

export const useFeatures = (
  features: FeatureId[],
  options?: {
    swr?: SWRInfiniteConfiguration<FetchOneFeatureTransformedResult>,
    cache?: boolean
  },
) => {
  const env = useEnvContext()
  const currentAppToken = useCurrentAppToken()

  const { baseUrl: osmBaseUrl, appToken: osmAppToken } = getOSMAPI(env, currentAppToken, options?.cache ?? false)
  const { baseUrl: acBaseUrl, appToken: acAppToken } = getAccessibilityCloudAPI(env, currentAppToken, options?.cache ?? false)

  // building additional properties, such as the fetcher can add additional attributes
  const fetcherProperties: Record<string, FetchOneFeatureProperties> = { }
  const fetchKeys: string[] = []
  for (let i = 0; i < features.length; i += 1) {
    const feature = features[i]
    const isOsmFeature = isOSMId(feature)
    const url = makeFetchUri(feature, {
      acBaseUrl, acAppToken, osmBaseUrl, osmAppToken,
    })

    const property = { kind: (isOsmFeature ? 'osm' as const : 'ac' as const), url, id: feature }
    fetcherProperties[url] = property
    fetchKeys.push(url)
  }

  const fetchOneFeature = composeFetchOneFeature(fetcherProperties)

  return useSWRInfinite((index) => fetchKeys[index], fetchOneFeature, options?.swr)
}
