import { SWRConfiguration } from 'swr'
import useSWRInfinite from 'swr/infinite'
import { useCallback } from 'react'
import assert from 'assert'
import { AnyFeature } from '../model/geo/AnyFeature'
import { getOSMAPI } from './osm-api/useOSMAPI'
import { getAccessibilityCloudAPI } from './ac/useAccessibilityCloudAPI'
import { useEnvContext } from '../context/EnvContext'
import { useCurrentAppToken } from '../context/AppContext'
import { databaseTableNames } from '../../components/MapNew/filterLayers'
import { AccessibilityCloudRDFType } from '../model/typing/AccessibilityCloudTypeMapping'

/**
 * Brands a type
 */
export type Brand<Type, Name extends `__${string}_brand`> = Type & { [key in Name]: never }

export type FeatureId = Brand<string, '__feature_id_brand'>
export type AccessibilityCloudId = Brand<FeatureId, '__ac:feature_id_brand'> & `${AccessibilityCloudRDFType}/${string}`
export type OSMFeatureNumericId = Brand<number, '__osm_feature_numeric_id_brand'>

export type NWR = 'node' | 'way' | 'relation'
export type OSMTableName = typeof databaseTableNames[number]
export type OpenStreetMapId = Brand<`osm:${NWR}/${OSMFeatureNumericId}`, '__openstreetmap_id_brand'>
// eslint-disable-next-line max-len, @stylistic/js/max-len
export type OpenStreetMapIdWithTableName = Brand<`osm:${OSMTableName}/${NWR}/${OSMFeatureNumericId}`, '__openstreetmap_id_with_table_name_brand'>

/**
 * Not only fetches feature data from OSM **or** AC, but also loads additional data,
 * like AC-SameAs relations and data attributed to it effectively starts multiple fetch requests to multiple backends
 */
export const fetchOneFeature = () => {}

export const useResolveAllFeatures = () => {}

const matchOsmId = /osm:(?<tableName>[a-z_0-9]+)\/(?<nwr>node|way|relation)\/(?<id>\d+)/
const isOsmIdWithTableName = (x: string): x is OpenStreetMapIdWithTableName => matchOsmId.test(x)
const getOsmIdComponents = (id: OpenStreetMapIdWithTableName) => {
  const match = id.match(/osm:(?<tableName>[a-z_0-9]+)\/(?<nwr>node|way|relation)\/(?<id>\d+)/)
  // eslint-disable-next-line max-len, @stylistic/js/max-len
  assert(match?.groups, 'Could not parse OSM ID: The passed ID may not conform the parsing regex, no result returned. Please ensure the given OSM ID conforms to the format `osm:[tableName]:[node|way|relation]:[numeric ID]`.')
  // match has to exist, otherwise the entry type was wrong
  const { tableName, nwr, id: matchedId } = match!.groups as Partial<{ tableName: AccessibilityCloudRDFType, nwr: NWR, id: string }>
  return { tableName, nwr, id: Number(matchedId) as OSMFeatureNumericId }
}

export const useManyFeatures = (
  featureIds: (AccessibilityCloudId | OpenStreetMapIdWithTableName)[],
  options?: {
    swr?: SWRConfiguration<PromiseSettledResult<AnyFeature>[]>,
    // @TODO: better naming would be "useCDNCache" or something, reflecting the source URI for requests
    cache?: boolean
  },
) => {
  const env = useEnvContext()
  const currentAppToken = useCurrentAppToken()

  const makeUri = useCallback((featureId: AccessibilityCloudId | OpenStreetMapIdWithTableName) => {
    if (isOsmIdWithTableName(featureId)) {
      const { baseUrl, appToken } = getOSMAPI(env, currentAppToken, options?.cache ?? false)
      const { tableName, nwr, id } = getOsmIdComponents(featureId) ?? { }
      return `${baseUrl}/${tableName}/${nwr}/${id}.geojson?appToken=${appToken || ''}`.replaceAll('//', '/')
    }
    const { baseUrl, appToken } = getAccessibilityCloudAPI(env, currentAppToken, options?.cache ?? false)
    return `${baseUrl}/place-infos/${featureId}.json?appToken=${appToken}`
  }, [currentAppToken, env, options?.cache])

  const { data, size, setSize } = useSWRInfinite<AnyFeature>((index) => makeUri(featureIds[index]), fetchOneFeature, options?.swr)
  return { data, size, setSize }
}

/* scaffolding:
function resolveSameAsFeatureIds(features: AnyFeature[]) {
  const getId = (_: unknown) => '123'
  const featureIds = features.map((feature) => getId(feature))
  const resolvedAdditionalSameAsFeatureIds = features.flatMap((f) => {
    if (isPlaceInfo(f)) {
      return f.properties.sameAs
    }
  })
  return [...featureIds, ...resolvedAdditionalSameAsFeatureIds]
}

export const useTheUltimateExpanseOfFeaturesAndZeWorld = (
  featureIds: FeatureId[],
  options?: {
    swr?: SWRConfiguration<PromiseSettledResult<AnyFeature>[]>,
    // @TODO: better naming would be "useCDNCache" or something, reflecting the source URI for requests
    cache?: boolean
  },
) => {
  const originalFeatures = useManyFeatures(featureIds)
  const allUltimateExpandedWorldDominationFeatureIds = resolveSameAsFeatureIds(originalFeatures)
  const additionalFeatureIds = allUltimateExpandedWorldDominationFeatureIds
    .filter((id) => !featureIds.includes(id))
  const additionalResolvedFeatures = useManyFeatures(additionalFeatureIds)
  return [
    ...originalFeatures,
    ...additionalResolvedFeatures,
  ]
}

*/
