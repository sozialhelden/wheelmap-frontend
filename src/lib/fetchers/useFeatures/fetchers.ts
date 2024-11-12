import { t } from 'ttag'
import { PlaceInfo } from '@sozialhelden/a11yjson'
import { AnyFeature, TypeTaggedPlaceInfo } from '../../model/geo/AnyFeature'
import ResourceError from '../ResourceError'
import { FeatureId } from './types'
import { OSMRDFTableElementValue } from '../../typing/brands/osmIds'
import { AccessibilityCloudAPIFeatureCollectionResult } from '../ac/AccessibilityCloudAPIFeatureCollectionResult'

export type FetchOneFeatureResult = {
  feature: AnyFeature,
  url: string,
  origin: FeatureId
}

export interface FetchOneFeatureProperties {
  url: string
  kind: 'osm' | 'ac'
  id: FeatureId
}

export interface FetchOneFeatureTransformedResult extends FetchOneFeatureProperties {
  feature: AnyFeature
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

export const composeFetchOneFeature = (keyProperties: Record<string, FetchOneFeatureProperties>) => {
  const featureFetcher = async (fetchUri: string): Promise<FetchOneFeatureTransformedResult> => {
    const result = await genericFetcher<AnyFeature>(fetchUri)
    const extraProperties = keyProperties[fetchUri]
    return ({
      // @ts-ignore 2473
      feature: { '@type': extraProperties.kind === 'osm' ? 'osm:Feature' : 'ac:PlaceInfo', ...result }, ...extraProperties,
    })
  }
  return featureFetcher
}

export interface FetchOsmToAcFeatureProperties {
  url: string
  kind: 'ac'
  id: OSMRDFTableElementValue
}

export interface FetchOsmToAcFeatureTransformedResult extends FetchOsmToAcFeatureProperties {
  feature?: PlaceInfo
}

export const composeOsmToAcFetcher = (keyProperties: Record<string, FetchOsmToAcFeatureProperties>) => {
  const osmToAcFetcher = async (fetchUri: string): Promise<FetchOsmToAcFeatureTransformedResult> => {
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
