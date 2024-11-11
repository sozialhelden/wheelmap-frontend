import useSWR, { SWRConfiguration, SWRResponse } from 'swr'
import { AnyFeature, TypeTaggedPlaceInfo } from '../model/geo/AnyFeature'
import useOSMAPI from './osm-api/useOSMAPI'
import useAccessibilityCloudAPI from './ac/useAccessibilityCloudAPI'
import { fetchDocumentWithTypeTag } from './ac/fetchDocument'
import { AccessibilityCloudRDFType } from '../model/typing/AccessibilityCloudTypeMapping'
import { fetchOneOSMFeature } from './osm-api/fetchOneOSMFeature'
import { AccessibilityCloudAPIFeatureCollectionResult } from './ac/AccessibilityCloudAPIFeatureCollectionResult'

const fetchACFeature = ({
  acBaseUrl, acAppToken, id, rdfType,
}: { acBaseUrl: string,
  acAppToken: string,
  id: string,
  rdfType: AccessibilityCloudRDFType
}): Promise<AnyFeature | null> => fetchDocumentWithTypeTag({
  baseUrl: acBaseUrl, rdfType, _id: id, paramsString: `appToken=${acAppToken}`,
}) as Promise<AnyFeature>

const fetchOSMFeature = async ({ osmBaseUrl, osmAppToken, id }: { osmBaseUrl: string, osmAppToken: string, id: string }) => {
  const feature = await fetchOneOSMFeature({ baseUrl: osmBaseUrl, appToken: osmAppToken, prefixedId: id })
  return ({
    '@type': 'osm:Feature',
    ...(feature),
  } as AnyFeature)
}

// fetchACFeaturesWithSameAsURI
const fetchACtoOSMRelation = async ({ acBaseUrl, acAppToken, sameAsURI }: { acBaseUrl: string, acAppToken: string, sameAsURI: string }) => {
  const url = `${acBaseUrl}/place-infos.json?appToken=${acAppToken}&includePlacesWithoutAccessibility=1&sameAs=${sameAsURI}`
  const response = (await (await fetch(url)).json()) as AccessibilityCloudAPIFeatureCollectionResult<TypeTaggedPlaceInfo>
  return response
}

const someLoading = (...requests: SWRResponse<any, any, any>[]) => requests.some((x) => x.isLoading)
const firstData = <X=any, Y=any, Z=any>(...requests: (SWRResponse<X, Y, Z> | null | undefined)[]) => requests
  .find((x) => x?.data !== undefined)

export function useFeature(
  id: string | undefined,
  options?: SWRConfiguration<AnyFeature> & { cached?: boolean },
) {
  const { cached = false, ...remainingOptions } = options || { }
  const { baseUrl: osmBaseUrl, appToken: osmAppToken } = useOSMAPI({ cached })
  const { baseUrl: acBaseUrl, appToken: acAppToken } = useAccessibilityCloudAPI({ cached })

  // if the feature is from OSM, we need a second request to find "same as" places that match AC PlaceInfos
  const isOsmFeature = !!id?.match(/^(way|node|relation)\/\d+$/)
  // if the feature is from accessibility.cloud and has a `sameAs` property, we need a second
  // request to fetch its associated OSM place.
  const isAcFeature = !isOsmFeature

  const acFeatureId = isAcFeature ? id?.replace(/^ac:/, '') : undefined
  const osmFeatureId = isOsmFeature ? id?.replace(/^osm:/, '').replace('/', ':') : undefined

  // if the feature is an AC PlaceInfo, load the place info from the AC API
  const fetchAcFeatureParams = acFeatureId ? {
    acBaseUrl, acAppToken, id: acFeatureId, rdfType: 'ac:PlaceInfo',
  } : undefined
  const acFeatureViaACID = useSWR(fetchAcFeatureParams, fetchACFeature, remainingOptions)

  // relation of an AC PlaceInfo to the OSM id
  const properties = acFeatureViaACID.data?.properties ?? {}
  const sameAsProperty: string[] | undefined = 'sameAs' in properties ? (properties.sameAs as string[]) : undefined
  const firstSameAsURI = sameAsProperty?.[0]
  // either the original OSM feature ID or the sameAs info should exists eventually
  const osmURI = osmFeatureId ? `https://openstreetmap.org/${osmFeatureId}` : sameAsProperty?.[0]
  const osmId = osmFeatureId || firstSameAsURI?.replace(/^https:\/\/openstreetmap.org\//, '').replaceAll('/', ':')

  const fetchOsmFeatureAmenitiesParams = osmId ? { osmBaseUrl, osmAppToken, id: `amenities:${osmId}` } : undefined
  const amenityOsmFeature = useSWR(fetchOsmFeatureAmenitiesParams, fetchOSMFeature, remainingOptions)

  const fetchOsmFeatureBuildingParams = osmId ? { osmBaseUrl, osmAppToken, id: `buildings:${osmId}` } : undefined
  const buildingOsmFeature = useSWR(fetchOsmFeatureBuildingParams, fetchOSMFeature, remainingOptions)

  const acFeatureViaSameAsURIParams = osmURI ? { acBaseUrl, acAppToken, sameAsURI: osmURI } : undefined
  const acFeatureViaSameAsURI = useSWR(acFeatureViaSameAsURIParams, fetchACtoOSMRelation)

  return {
    /** Is there more data still in progress of loading */
    isLoading: someLoading(amenityOsmFeature, buildingOsmFeature, acFeatureViaSameAsURI, acFeatureViaACID),
    /** The feature result of AccessibilityCloud */
    accessibilityCloudFeature: (acFeatureViaSameAsURI || acFeatureViaACID)?.data,
    /** The first feature result of OSM, either via building or amenity */
    osmFeature: firstData(amenityOsmFeature, buildingOsmFeature),
    // ... memoized enrichments
  }
}
