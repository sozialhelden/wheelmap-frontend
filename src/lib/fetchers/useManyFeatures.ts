import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import assert from 'assert'
import { t } from 'ttag'
import {
  BareFetcher, Key, SWRConfiguration, SWRHook, SWRResponse,
} from 'swr'
import { AnyFeature, TypeTaggedPlaceInfo } from '../model/geo/AnyFeature'
import { getOSMAPI } from './osm-api/useOSMAPI'
import { getAccessibilityCloudAPI } from './ac/useAccessibilityCloudAPI'
import { useEnvContext } from '../context/EnvContext'
import { useCurrentAppToken } from '../context/AppContext'
import { AccessibilityCloudRDFType } from '../model/typing/AccessibilityCloudTypeMapping'
import ResourceError from './ResourceError'
import { AccessibilityCloudAPIFeatureCollectionResult } from './ac/AccessibilityCloudAPIFeatureCollectionResult'

/**
 * Brands a type
*/
/*
export type Brand<Type, Name extends `__${string}_brand`> = Type & { [key in Name]: never }

export type FeatureId = Brand<string, '__feature_id_brand'>
export type AccessibilityCloudId = Brand<FeatureId, '__ac:feature_id_brand'> & `${AccessibilityCloudRDFType}/${string}`
export type OSMFeatureNumericId = Brand<number, '__osm_feature_numeric_id_brand'>

export type NWR = 'node' | 'way' | 'relation'
export type OSMTableName = typeof databaseTableNames[number]
export type OpenStreetMapId = Brand<`osm:${NWR}/${OSMFeatureNumericId}`, '__openstreetmap_id_brand'>
// eslint-disable-next-line max-len, @stylistic/js/max-len, max-len
*/

const matchOsmId = /(osm:)?(?<tableName>[a-z_0-9]+):(?<nwr>node|way|relation):(?<id>\d+)/
const isOsmIdWithTableName = (x: string) => matchOsmId.test(x)

const AccessibilityCloudRDFTypes: AccessibilityCloudRDFType[] = ['ac:EquipmentInfo',
  'ac:Entrance',
  'ac:PlaceInfo',
  'ac:App',
  'ac:MappingEvent',
  'ac:Source',
  'ac:AccessibilityAttribute']
const isAccessibilityCoudId = (featureId: string) => {
  const components = featureId.split('/')
  if (components.length < 2) {
    return false
  }

  const [rdfType] = components
  if (AccessibilityCloudRDFTypes.find((x) => x === rdfType)) {
    return true
  }
  return false
}

const getOsmIdComponents = (id: string) => {
  const match = id.match(matchOsmId)
  // eslint-disable-next-line max-len, @stylistic/js/max-len
  assert(match?.groups, 'Could not parse OSM ID: The passed ID may not conform the parsing regex, no result returned. Please ensure the given OSM ID conforms to the format `osm:[tableName]:[node|way|relation]:[numeric ID]`.')
  // match has to exist, otherwise the entry type was wrong
  const { tableName, nwr, id: matchedId } = match!.groups as Partial<{ tableName: AccessibilityCloudRDFType, nwr: string, id: string }>
  return { tableName, nwr, id: Number(matchedId) }
}

const makeUri = (featureId: string, {
  acBaseUrl, acAppToken, osmBaseUrl, osmAppToken,
} : Partial<FetchOptions>) => {
  if (isOsmIdWithTableName(featureId)) {
    if (!osmBaseUrl || !osmAppToken) {
      throw new Error(t`OSM API Configuration incomplete, baseUrl or appToken was missing`)
    }
    const { tableName, nwr, id } = getOsmIdComponents(featureId) ?? { }
    return ['osm', `${osmBaseUrl}/${tableName}/${nwr}/${id}.geojson?appToken=${osmAppToken || ''}`.replaceAll('//', '/')] as const
  }
  if (isAccessibilityCoudId(featureId)) {
    if (!acBaseUrl || !acAppToken) {
      throw new Error(t`AccessibilityCloud API Configuration incomplete, baseUrl or appToken was missing`)
    }
    return ['ac', `${acBaseUrl}/place-infos/${featureId}.json?appToken=${acAppToken}`] as const
  }
  throw new Error(t`The featureId '${featureId}' is of unknown format`)
}

interface ACFetchOptions {
  acBaseUrl: string,
  acAppToken: string
}

interface OSMFetchOptions {
  osmBaseUrl: string,
  osmAppToken: string
}
type FetchOptions = ACFetchOptions & OSMFetchOptions

export const buildFetchOneFeature = (options : Partial<FetchOptions>) => async (featureId: string): Promise<{
  feature: AnyFeature, url: string, origin: string, kind: 'osm' | 'ac'
}> => {
  // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
  const [kind, url] = makeUri(featureId, options)
  const request = await fetch(url)
  if (!request.ok) {
    const errorResponse = await request.json()
    const defaultReason = t`Sorry! Could not fetch from data from ${url}`

    throw new ResourceError(errorResponse.reason || defaultReason, errorResponse.details, request.status, request.statusText)
  }

  const feature = (await request.json()) satisfies AnyFeature
  return {
    feature: { '@type': kind === 'osm' ? 'osm:Feature' : 'ac:PlaceInfo', ...feature }, url, origin: featureId, kind,
  }
}

export const useResolveAllFeatures = () => {}

export const useManyFeatures = (
  featureIds: string[],
  options?: {
    swr?: SWRInfiniteConfiguration<{ feature: AnyFeature, url: string, origin: string, kind: 'osm' | 'ac' }>,
    // @TODO: better naming would be "useCDNCache" or something, reflecting the source URI for requests
    cache?: boolean
  },
) => {
  const env = useEnvContext()
  const currentAppToken = useCurrentAppToken()

  const { baseUrl: osmBaseUrl, appToken: osmAppToken } = getOSMAPI(env, currentAppToken, options?.cache ?? false)
  const { baseUrl: acBaseUrl, appToken: acAppToken } = getAccessibilityCloudAPI(env, currentAppToken, options?.cache ?? false)
  const fetcher = buildFetchOneFeature({
    osmBaseUrl, osmAppToken, acBaseUrl, acAppToken,
  })
  return useSWRInfinite((index) => featureIds[index], fetcher, { parallel: true, ...options?.swr })
}

const buildSameAsFetcher = ({ acBaseUrl, acAppToken }: Partial<ACFetchOptions>) => async (featureId: string) => {
  const osmURL = `https://openstreetmap.org/${featureId}`
  if (!acBaseUrl || !acAppToken) {
    throw new Error(t`AccessibilityCloud API Configuration incomplete, baseUrl or appToken was missing`)
  }
  const url = `${acBaseUrl}/place-infos.json?appToken=${acAppToken}&includePlacesWithoutAccessibility=1&sameAs=${osmURL}`

  const request = await fetch(url)
  if (!request.ok) {
    const errorResponse = await request.json()
    const defaultReason = t`Sorry! Could not load OSM feature '${featureId}' place info from AccessibilityCloud`
    throw new ResourceError(errorResponse.reason || defaultReason, errorResponse.details, request.status, request.statusText)
  }
  const response = (await request.json()) as AccessibilityCloudAPIFeatureCollectionResult<TypeTaggedPlaceInfo>
  return { feature: response, url, origin: featureId }
}
export const useOsmSameAsFeatures = (
  featureIds?: string[],
  options?: {
    swr?: SWRInfiniteConfiguration<{
      feature: AccessibilityCloudAPIFeatureCollectionResult<TypeTaggedPlaceInfo>,
      url: string,
      origin: string
    }>,
    cache?: boolean
  },
) => {
  const env = useEnvContext()
  const currentAppToken = useCurrentAppToken()

  const { baseUrl: acBaseUrl, appToken: acAppToken } = getAccessibilityCloudAPI(env, currentAppToken, options?.cache ?? false)
  const fetcher = buildSameAsFetcher({ acBaseUrl, acAppToken })

  return useSWRInfinite((idx) => featureIds?.[idx], fetcher, { parallel: true, ...options?.swr })
}

// eslint-disable-next-line max-len, @stylistic/js/max-len
type MW<Data extends Promise<{ feature: AccessibilityCloudAPIFeatureCollectionResult<TypeTaggedPlaceInfo>; url: string; origin: string; }> = any, Error = any> = (useSWRNext: SWRHook) => (key: Key, fetcher: BareFetcher<Data> | null, config: SWRConfiguration<Data, Error, BareFetcher<Data>>) => SWRResponse<Data, Error>

// eslint-disable-next-line max-len, @stylistic/js/max-len

type RetType = Awaited<ReturnType<ReturnType<typeof buildSameAsFetcher>>>

const buildMySwrMiddleWareWithCustomOrigin = (redirect: Record<string, string>) => {
  const swrMiddleware: MW<RetType[]> = (useSWRNext) => (key, fetcher, config) => {
    // ...
    const swr = useSWRNext(key, fetcher, config)
    if (swr.data) {
      // const promise = swr.data.then((x) => ({ ...x, origin: redirect[x.origin] }))
      return { ...swr, data: swr.data.map((x) => ({ ...x, origin: redirect[x.origin] })) }
    }
    return swr
  }
  return swrMiddleware
}

export const useExpandedFeatures = (
  featureIds: string[],
  options?: {
    manyFeaturesSWRConfig?: SWRInfiniteConfiguration<{ feature: AnyFeature, url: string, origin: string, kind: 'osm' | 'ac' }>,
    sameAsSWRConfig?: SWRInfiniteConfiguration<{
      feature: AccessibilityCloudAPIFeatureCollectionResult<TypeTaggedPlaceInfo>,
      url: string,
      origin: string
    }>
    cache?: boolean
  },
) => {
  // first, from top down, fetch all features, which are still mixed AC and OSM features
  const manyFeaturesResult = useManyFeatures(featureIds, options ? { swr: options.manyFeaturesSWRConfig, cache: options.cache } : undefined)
  const { data: manyFeaturesResultData } = manyFeaturesResult

  // now it's easy to filter all OSM results, based on the assumptions the fetcher did which one is which
  const osmFeatures = manyFeaturesResultData?.filter((manyFeaturesResultEntry) => manyFeaturesResultEntry.kind === 'osm')

  const lookupmap = osmFeatures?.reduce((curr, value) => ({ ...curr, [value.feature._id]: value.origin }), ({ })) ?? {}

  const opts = {
    swr: { ...options?.sameAsSWRConfig, use: [...(options?.sameAsSWRConfig?.use ?? []), buildMySwrMiddleWareWithCustomOrigin(lookupmap)] },
    cache: options?.cache ?? false,
  }
  // the osm features now need to be refetched by asking the AC API if it knows additional details on its side
  const sameAsResult = useOsmSameAsFeatures(
    osmFeatures?.map((x) => x.feature._id),
    {
      swr: { use: [buildMySwrMiddleWareWithCustomOrigin(lookupmap)] },
    },
  )

  return {
    manyFeatures: manyFeaturesResult,
    sameAs: sameAsResult,
    isLoading: manyFeaturesResult.isLoading || sameAsResult.isLoading,
    isValidating: manyFeaturesResult.isValidating || sameAsResult.isValidating,
  }
}

export const collectExpandedFeaturesResult = (
  featureIds: string[],
  { manyFeatures, sameAs }: ReturnType<typeof useExpandedFeatures>,
) => {
  const resolvedEntries: Record<(typeof featureIds)[number], {
    original: AnyFeature,
    sameAs?: AccessibilityCloudAPIFeatureCollectionResult<TypeTaggedPlaceInfo>,
    sameAsData?: AnyFeature
  }> = {}
  // for debugging:
  let seenOriginalEntries = 0
  let seenSameAsEntries = 0
  featureIds.forEach((featureId) => {
    const originalDataEntry = manyFeatures?.data?.find((originalFeature) => originalFeature.origin === featureId)
    const sameAsDataRelation = sameAs?.data?.find((sameAsRelation) => sameAsRelation.origin === featureId)

    if (originalDataEntry) {
      seenOriginalEntries += 1
    }
    if (sameAsDataRelation) {
      seenSameAsEntries += 1
    }

    resolvedEntries[featureId] = {
      original: originalDataEntry?.feature!,
      sameAs: sameAsDataRelation?.feature,
    }
  })

  assert(
    () => seenOriginalEntries !== (manyFeatures?.data?.length ?? 0),
    // eslint-disable-next-line max-len, @stylistic/js/max-len
    t`Unexpected: There are ${manyFeatures?.data?.length} entries loaded, but ${seenOriginalEntries} have been matched with ${featureIds.length} passed featureIds`,
  )

  assert(
    () => seenSameAsEntries !== (sameAs?.data?.length ?? 0),
    t`Unexpected: There are ${sameAs?.data?.length} sameAs relations loaded, but ${seenSameAsEntries} have been matched`,
  )

  return resolvedEntries
}
