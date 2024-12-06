import { AccessibilityCloudRDFType } from '../../model/typing/AccessibilityCloudTypeMapping'
import { Brand } from './brand'

/**
 * @example '"ac:PlaceInfo/123"' is an RDF URI. `ac:` is the prefix that is expanded to
 * https://accessibility.cloud, and `PlaceInfo` is the type of the entity.
 *
 */
export type AccessibilityCloudRDFId = Brand<`${AccessibilityCloudRDFType}/${string}`, '@brand_ac_rdf_id'>

/**
 * @example '"ac:PlaceInfo:123"' is handed over as URI parameter, for example in paths like
 * `/ac:PlaceInfo:fZcX8baW6XHHh6BzL,buildings:way:163936717`. The `/` becomes a `:` here, so it's
 * not a valid RDF URI. It would be more 'correct' to use %2F instead of `:` in the URI, but
 * this would be less human-readable.
 */
export type AccessibilityCloudURIParameterId = Brand<`${AccessibilityCloudRDFType}:${string}`, '@brand_ac_uri_parameter_id'>
