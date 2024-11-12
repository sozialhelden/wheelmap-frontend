import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import { OSMRDFTableElementValue } from '../../typing/brands/osmIds'
import { useEnvContext } from '../../context/EnvContext'
import { useCurrentAppToken } from '../../context/AppContext'
import { getAccessibilityCloudAPI } from '../ac/useAccessibilityCloudAPI'
import { composeOsmToAcFetcher, FetchOsmToAcFeatureProperties, FetchOsmToAcFeatureTransformedResult } from './fetchers'
import { getOSMRDFComponents } from '../../typing/discriminators/osmDiscriminator'

export const useOsmToAcFeature = (
  features: OSMRDFTableElementValue[],
  options?: {
    swr?: SWRInfiniteConfiguration<FetchOsmToAcFeatureTransformedResult>,
    cache?: boolean
  },
) => {
  const env = useEnvContext()
  const currentAppToken = useCurrentAppToken()
  const { baseUrl: acBaseUrl, appToken: acAppToken } = getAccessibilityCloudAPI(env, currentAppToken, options?.cache ?? false)

  // building additional properties, such as the fetcher can add additional attributes
  const fetcherProperties: Record<string, FetchOsmToAcFeatureProperties> = { }
  const fetchKeys: string[] = []
  for (let i = 0; i < features.length; i += 1) {
    const feature = features[i]
    const components = getOSMRDFComponents(feature)

    const osmUrl = `https://openstreetmap.org/${components.properties.element}/${components.properties.value}`
    const url = `${acBaseUrl}/place-infos.json?appToken=${acAppToken}&includePlacesWithoutAccessibility=1&sameAs=${osmUrl}`

    const property = { kind: 'ac' as const, url, id: feature }
    fetcherProperties[url] = property
    fetchKeys.push(url)
  }

  const fetchOsmToAcFeature = composeOsmToAcFetcher(fetcherProperties)
  return useSWRInfinite((index) => fetchKeys[index], fetchOsmToAcFeature, options?.swr)
}
