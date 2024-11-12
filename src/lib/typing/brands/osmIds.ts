import { databaseTableNames } from '../../../components/MapNew/filterLayers'
import { Brand } from './brand'

export type OSMFeatureNumericId = Brand<number, '@brand_osm_feature_numeric_id'>

export type AnyOSMId = OSMElementValue | OSMElementValue_Deprecated | OSMTableElementValue | OSMRDFTableElementValue

// table/element/value
type OSMValue = `${number}`
export const osmElement = ['node', 'way', 'relation'] as const
export type OSMElement = (typeof osmElement)[number]

export type OSMElementValue = Brand<`${OSMElement}:${OSMValue}`, '@brand_osm_element_value_id'>
// eslint-disable-next-line @typescript-eslint/naming-convention
export type OSMElementValue_Deprecated = Brand<`${OSMElement}/${OSMValue}`, '@brand_osm_element_value_legacy_id'>

export type OSMKey = typeof databaseTableNames[number]
export type OSMTableElementValue = Brand<`${OSMKey}:${OSMElement}:${OSMValue}`, '@brand_osm_key_element_value_id'>

export type OSMRDF = 'osm' | 'osm-inhouse'
export type OSMRDFTableElementValue = Brand<`${OSMRDF}:${OSMKey}:${OSMElement}:${OSMValue}`, '@brand_osm_rdf_key_element_value_id'>
/**
 * Normalized, structured and parsable OSM id
 */
export type OSMId = OSMRDFTableElementValue

/*
OSM IDs:

-123890123890

// relates to AC place info
nodes/gjgDFHjrbhne

// way | relation (primär way)
nodes/-123890123890
// node
nodes/123890123890

(node|way|relation)/123890123890
(typeof databaseTableNames[number])/(node|way|relation)/123890123890

(typeof databaseTableNames[number]):(node|way|relation):123890123890

// origin
osm-ac:${OSMKey}:${OSMElement}:${OSMValue}
osm:${OSMKey}:${OSMElement}:${OSMValue}

// goal:
// ex: osm-inhouse:toilets/way/1240981
osm-inhouse:key/element/value
// ex: osm:toilets/way/1240981
osm:key/element/value

ac:PlaceInfo/123094805

*/
