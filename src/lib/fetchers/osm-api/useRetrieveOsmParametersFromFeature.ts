import useSWR from 'swr'
import { useRouter } from 'next/router'
import { isOSMFeature } from '../../model/geo/AnyFeature'
import { getOSMType } from '../../model/osm/generateOsmUrls'
import { getFeatureId } from '../../model/ac/Feature'
import { fetchFeaturePrefixedId } from './fetchFeaturePrefixedId'

export default function useRetrieveOsmParametersFromFeature(feature) {
  const router = useRouter()
  const { id, tagKey } = router.query
  const tagName = typeof tagKey === 'string' ? tagKey : tagKey[0]
  const osmType = getOSMType(feature)
  const osmId = getFeatureId(feature)
  return {
    tagName, osmType, osmId
  }
}
