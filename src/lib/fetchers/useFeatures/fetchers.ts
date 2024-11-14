import { t } from 'ttag'
import { PlaceInfo } from '@sozialhelden/a11yjson'
import { TypeTaggedOSMFeature, TypeTaggedPlaceInfo } from '../../model/geo/AnyFeature'
import ResourceError from '../ResourceError'
import { FeatureId } from './types'
import { OSMRDFTableElementValue } from '../../typing/brands/osmIds'
import { AccessibilityCloudAPIFeatureCollectionResult } from '../ac/AccessibilityCloudAPIFeatureCollectionResult'
import OSMFeature from '../../model/osm/OSMFeature'

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
 * Composes a fetcher to fetch a feature, that will be tagged with origin url
 */
export const composeFetchOneFeature = (keyProperties: Record<string, FetchOneFeatureProperties>) => {
  const featureFetcher = async (fetchUri: string): Promise<FetchOneFeatureResult> => {
    const result = await genericFetcher<OSMFeature | PlaceInfo>(fetchUri)
    // the type tag will be injected into the data result
    const { typeTag, ...extraProperties } = keyProperties[fetchUri]
    return ({
      // @ts-ignore 2473
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
  feature?: PlaceInfo
}

export const composeOsmToAcFetcher = (keyProperties: Record<string, FetchOsmToAcFeatureProperties>) => {
  const osmToAcFetcher = async (fetchUri: string): Promise<FetchOsmToAcFeatureResult> => {
    const result = await genericFetcher<AccessibilityCloudAPIFeatureCollectionResult<TypeTaggedPlaceInfo>>(fetchUri)
    const extraProperties = keyProperties[fetchUri]
    return {
      // @ts-ignore 2473
      feature: result.features[0] ? { '@type': 'ac:PlaceInfo', ...result.features[0] } : undefined,
      ...extraProperties,
    }
  }
  return osmToAcFetcher
}
