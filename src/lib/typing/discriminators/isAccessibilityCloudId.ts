import { AccessibilityCloudRDFTypes } from '../../model/typing/AccessibilityCloudTypeMapping'
import { AccessibilityCloudRDFId } from '../brands/accessibilityCloudIds'

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
