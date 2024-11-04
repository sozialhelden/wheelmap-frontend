import useSWR from 'swr'
import { useRouter } from 'next/router'
import { isOSMFeature } from '../../model/geo/AnyFeature'
import { getOSMType } from '../../model/osm/generateOsmUrls'
import { getFeatureId } from '../../model/ac/Feature'
import { fetchFeaturePrefixedId } from './fetchFeaturePrefixedId'

export default function retrieveOsmParametersFromFeature(feature) {
  const router = useRouter()
  const { id, tagKey } = router.query
  const tagName = typeof tagKey === 'string' ? tagKey : tagKey[0]
  const osmFeature = isOSMFeature(feature) ? feature : undefined
  const osmType = getOSMType(osmFeature)
  const osmId = getFeatureId(osmFeature)
  const currentOSMObjectOnServer = useSWR(osmFeature?._id, fetchFeaturePrefixedId)
  // console.log('current object on server: ', currentOSMObjectOnServer.data)
  const currentTagsOnServer = currentOSMObjectOnServer.data?.tags
  return {
    id, tagName, osmFeature, osmType, osmId, currentOSMObjectOnServer,
  }
}
