/* eslint-disable @stylistic/js/max-len */
/* eslint-disable max-len */
import { databaseTableNames } from '../../../components/Map/filterLayers'
import { Brand } from './brand'

export type OSMFeatureNumericId = Brand<number, '@brand_osm_feature_numeric_id'>

export type AnyOSMId = OSMTypedId | OSMTypedId_Deprecated | OSMIdWithTypeAndTableName | OSMIdWithTableAndContextNames

type OsmSeperator = ':' | '/'

// table/element type/value
type OSMNumericValue = `${number}`
export const osmElement = ['node', 'way', 'relation'] as const
export type OSMElementType = (typeof osmElement)[number]

export type OSMTypedId = Brand<`${OSMElementType}${OsmSeperator}${OSMNumericValue}`, '@brand_osm_element_value_id'>
// eslint-disable-next-line @typescript-eslint/naming-convention
export type OSMTypedId_Deprecated = Brand<`${OSMElementType}${OsmSeperator}${OSMNumericValue}`, '@brand_osm_element_value_legacy_id'>

export type OSMInhouseDatabaseTableName = typeof databaseTableNames[number]
export type OSMIdWithTypeAndTableName = Brand<`${OSMInhouseDatabaseTableName}${OsmSeperator}${OSMElementType}${OsmSeperator}${OSMNumericValue}`, '@brand_osm_key_element_value_id'>

/**
 * When referring to the original OSM element, the context is 'osm', when referring to the OSM
 * element as fetched from our in-house OSM mirror API, the context is 'osm-inhouse'.
 */
export type OSMRDFContextName = 'osm' | 'osm-inhouse'
export type OSMIdWithTableAndContextNames = Brand<`${OSMRDFContextName}:${OSMInhouseDatabaseTableName}/${OSMElementType}/${OSMNumericValue}`, '@brand_osm_rdf_key_element_value_id'>

/**
 * Normalized, structured and parsable OSM id
 */
export type OSMId = OSMIdWithTableAndContextNames

/*
 * Websites still have old Wheelmap links using a very old legacy version URL schema
 * that was based on ways and relations converted to nodes with a negative number ID in a
 * 'classic' Wheelmap version. The conversion had been done in the backend, for performance
 * reasons. Unfortunately, to save storage space, the original IDs weren't included so we have to
 * guess the feature that was originally meant. Luckily, the original feature type is usually
 * either a multipolygon (relation) or a way that can be found in our amenities DB, so a
 * resolution is still possible in most cases.
 */
export namespace LegacyOsmId {
  export type NegativeOsmValue = Brand<`-${number}`, '@brand_deprecated_osm_value'>
  type PositiveOsmValue = `${number}`

  export type MongoDbOsmValue = Brand<`nodes/${string}`, '@brand_deprected_mongo_db_osm_value'>

  /**
   * The guess is, that these are _usually_ either a 'way' or a 'relation".
   * @example
   * ```ts
   * 'nodes/-123890123890' ~= 'way/-123890123890'
   * 'nodes/-123890123890' ~= 'relation/-123890123890'
   * 'nodes/123890123890'  ~= 'node/123890123890'
   * ```
   */
  export type WronglyTypedLegacyOsmId = Brand<`nodes/${NegativeOsmValue}` | `nodes/${PositiveOsmValue}`, '@brand_deprecated_osm_node_value'>

  export type AnyLegacyOsmId = NegativeOsmValue | MongoDbOsmValue | WronglyTypedLegacyOsmId
}