import { AccessibilityCloudRDFType } from '../../model/typing/AccessibilityCloudTypeMapping'
import { AccessibilityCloudRDFId } from '../brands/accessibilityCloudIds'

const AccessibilityCloudRDFTypes: AccessibilityCloudRDFType[] = [
  'ac:EquipmentInfo',
  'ac:Entrance',
  'ac:PlaceInfo',
  'ac:App',
  'ac:MappingEvent',
  'ac:Source',
  'ac:AccessibilityAttribute',
] as const

export const isAccessibilityCloudId = (featureId: string): featureId is AccessibilityCloudRDFId => {
  const components = featureId.split('/')
  if (components.length < 2) {
    return false
  }

  const [rdfType] = components
  if (AccessibilityCloudRDFTypes.find((x) => x === rdfType)) {
    return true
  }
  return false
}
