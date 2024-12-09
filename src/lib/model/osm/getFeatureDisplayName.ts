import { getLocalizableStringForOSMKey } from './getLocalizableStringForOSMKey'
import OSMFeature from './OSMFeature'

export default function getFeatureDisplayName(feature: OSMFeature) {
  const { properties } = feature

  const ownName = getLocalizableStringForOSMKey(feature, 'name')
    || properties.name
    || properties.loc_name
    || properties.description
    || properties.ref
    || properties['building:name']
    || properties['building:number']

  if (ownName) {
    return ownName
  }
  return undefined
}
