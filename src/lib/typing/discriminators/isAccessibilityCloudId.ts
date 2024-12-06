import { AccessibilityCloudRDFTypes } from '../../model/typing/AccessibilityCloudTypeMapping'
import type { AccessibilityCloudRDFId, AccessibilityCloudURIParameterId } from '../brands/accessibilityCloudIds'

export const accessibilityCloudIdRegExp = new RegExp(`^(${AccessibilityCloudRDFTypes.join('|')})[/:]([0-9a-zA-Z]+)$`)

export const isAccessibilityCloudId = (featureId: string): featureId is AccessibilityCloudRDFId | AccessibilityCloudURIParameterId => {
  return !!featureId.match(accessibilityCloudIdRegExp);
}
