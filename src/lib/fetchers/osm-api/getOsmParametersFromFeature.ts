import {getOSMType} from '../../model/osm/generateOsmUrls'
import {getFeatureId} from '../../model/ac/Feature'

export default function getOsmParametersFromFeature(feature, tagKey) {
  const tagName = typeof tagKey === 'string' ? tagKey : tagKey[0]
  const osmType = getOSMType(feature)
  const osmId = getFeatureId(feature)
  return {
    tagName, osmType, osmId
  }
}
