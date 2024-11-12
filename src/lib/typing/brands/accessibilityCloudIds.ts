import { AccessibilityCloudRDFType } from '../../model/typing/AccessibilityCloudTypeMapping'
import { Brand } from './brand'

export type AccessibilityCloudRDFId = Brand<`${AccessibilityCloudRDFType}/${string}`, '@brand_ac_rdf_id'>
