import type { PlaceInfo } from '@sozialhelden/a11yjson'
import { t } from 'ttag'
import type { TypeTaggedOSMFeature, TypeTaggedPlaceInfo } from '../../model/geo/AnyFeature'
import type OSMFeature from '../../model/osm/OSMFeature'
import type { OSMRDFTableElementValue } from '../../typing/brands/osmIds'
import ResourceError from '../ResourceError'
import type { AccessibilityCloudAPIFeatureCollectionResult } from '../ac/AccessibilityCloudAPIFeatureCollectionResult'
import type { FeatureId } from './types'

export interface FetchOneFeatureProperties {
  url: string
  typeTag: TypeTaggedOSMFeature['@type'] | TypeTaggedPlaceInfo['@type']
  id: FeatureId
}

export interface FetchOneFeatureResult extends FetchOneFeatureProperties {
  feature: TypeTaggedOSMFeature | TypeTaggedPlaceInfo
}

/**
 * Fetches a resource from an URI and blindly assumes the result being of the generic type
 */
export const genericFetcher = async <Result = unknown>(fetchUri: string): Promise<Result> => {
  const request = await fetch(fetchUri)
  if (!request.ok) {
    const errorResponse = await request.json()
    const defaultReason = t`Sorry! Could not fetch from data from ${fetchUri}`

    throw new ResourceError(errorResponse.reason || defaultReason, errorResponse.details, request.status, request.statusText)
  }
  const feature = (await request.json()) satisfies Result
  return feature
}

/**
 * Composes a fetcher to fetch a feature, that will be tagged with the given properties
 */
export const composeFetchOneFeature = (keyProperties: Record<string, FetchOneFeatureProperties>) => {
  const featureFetcher = async (fetchUri: string): Promise<FetchOneFeatureResult> => {
    const result = await genericFetcher<OSMFeature | PlaceInfo>(fetchUri)
    // the type tag will be injected into the data result
    const { typeTag, ...extraProperties } = keyProperties[fetchUri]

    return ({
      feature: { '@type': typeTag, ...result }, ...extraProperties,
    })
  }
  return featureFetcher
}

export interface FetchOsmToAcFeatureProperties {
  url: string
  id: OSMRDFTableElementValue
}

export interface FetchOsmToAcFeatureResult extends FetchOsmToAcFeatureProperties {
  feature?: TypeTaggedPlaceInfo
}

/**
 * Composes a fetcher to fetch a place that exists in AccessibilityCloud by an OSM-URL, ex: https://openstreetmap.org/node/295892
 * The URL has to be prepared before, to guarantee SWR cache consistency
 */
export const composeOsmToAcFetcher = (keyProperties: Record<string, FetchOsmToAcFeatureProperties>) => {
  const osmToAcFetcher = async (fetchUri: string): Promise<FetchOsmToAcFeatureResult> => {
    const result = await genericFetcher<AccessibilityCloudAPIFeatureCollectionResult<PlaceInfo>>(fetchUri)
    const extraProperties = keyProperties[fetchUri]
    const feature = result.features[0]
    // TypeTaggedPlaceInfo has some additional properties, that are now being injected
    return {
      feature: feature ? {
        '@type': 'ac:PlaceInfo',
        // this is basically a misnomer, but it's better than nothing
        _id: extraProperties.id,
        ...result.features[0],
        properties: {
          // this is basically a misnomer, but it's better than nothing
          _id: extraProperties.id,
          ...feature.properties,
        },
      } : undefined,
      ...extraProperties,
    }
  }
  return osmToAcFetcher
}
