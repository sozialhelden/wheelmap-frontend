import { AccessibilityCloudRDFId } from '../../typing/brands/accessibilityCloudIds'
import { OSMId } from '../../typing/brands/osmIds'

/** A map feature ID may either be AC ID or OSM ID in an fully qualified RDF format  */
export type FeatureId = (AccessibilityCloudRDFId | OSMId)
