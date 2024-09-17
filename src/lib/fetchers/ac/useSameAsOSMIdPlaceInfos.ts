import { SWRConfiguration } from 'swr'
import { PlaceInfo } from '@sozialhelden/a11yjson'
import { AccessibilityCloudAPIFeatureCollectionResult } from './AccessibilityCloudAPIFeatureCollectionResult'
import useCollectionSWR from './useCollectionSWR'

export const useSameAsOSMIdPlaceInfos = (
  osmUris: string[],
  options?: SWRConfiguration<AccessibilityCloudAPIFeatureCollectionResult<PlaceInfo>>,
) => useCollectionSWR<'ac:PlaceInfo', PlaceInfo, 'FeatureCollection'>({
  type: 'ac:PlaceInfo',
  params: new URLSearchParams({ sameAs: osmUris.join(','), includePlacesWithoutAccessibility: '1' }),
  options,
})
