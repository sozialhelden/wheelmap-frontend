import {
  AnyOSMId, OSMElementValue, OSMElementValue_Deprecated, OSMRDFTableElementValue,
  OSMElement,
  OSMRDF,
  OSMTableElementValue,
  LegacyOsmId,
} from '../brands/osmIds'
import { AccessibilityCloudRDFType } from '../../model/typing/AccessibilityCloudTypeMapping'

const matchValue = '(?<value>\\d+)'
const matchElement = '(?<element>node|way|relation)'
const matchTable = '(?<table>[\\w\\d_-]+)'
const matchRdf = '(?<rdf>osm(?:-inhouse)?)'
const matchSeperator = '[:/]'

const matchElementValueLegacy = new RegExp(`^${matchElement}${matchSeperator}${matchValue}$`)
const matchElementValue = new RegExp(`^${matchElement}${matchSeperator}${matchValue}$`)
const matchTableElementValue = new RegExp(`^${matchTable}${matchSeperator}${matchElement}${matchSeperator}${matchValue}$`)
const matchRdfTableElementValue = new RegExp(`^${matchRdf}:${matchTable}/${matchElement}/${matchValue}$`)

export const isOSMElementValue = (x: string): x is OSMElementValue => matchElementValue.test(x)
export const isOSMTableElementValue = (x: string): x is OSMTableElementValue => matchTableElementValue.test(x)
export const isOSMRdfTableElementValue = (x: string): x is OSMRDFTableElementValue => matchRdfTableElementValue.test(x)

// eslint-disable-next-line @typescript-eslint/naming-convention
export const isOSMElementValue_Legacy = (x: string): x is OSMElementValue_Deprecated => matchElementValueLegacy.test(x)

/**
 * Checks if a string conforms the OSM address format of
 * - {@link OSMElementValue}
 * - {@link OSMTableElementValue}
 * - {@link OSMRDFTableElementValue}
 * - {@link OSMElementValue_Deprecated}
 *
 * additional checking for legacy formats can be done with {@link isLegacyOSMId}
 */
export const isOSMId = (x: string): x is AnyOSMId => {
  if (isOSMElementValue(x)) {
    return true
  }

  if (isOSMTableElementValue(x)) {
    return true
  }
  if (isOSMRdfTableElementValue(x)) {
    return true
  }

  // keeping it right here, it's legacy, but not fully deprecated yet
  return isOSMElementValue_Legacy(x)
}

/**
 * Extracts RDF components from an OSM id in an object format
 */
export const getOSMRDFComponents = (osmId: OSMRDFTableElementValue) => {
  const match = osmId.match(matchRdfTableElementValue)
  // match has to exist, otherwise the entry type was wrong
  const {
    rdf, table, element, value,
  } = match!.groups as { rdf: OSMRDF, table: AccessibilityCloudRDFType, element: OSMElement, value: string }
  return {
    source: osmId,
    components: [rdf, table, element, value] as const,
    properties: {
      rdf, table, element, value,
    },
  }
}

const matchLegacyNodes = '(?<nodes>nodes)'
const matchLegacyValue = '(?<positive>\\d+)|(?<negative>-\\d+)'
const matchMongoDbValue = '(?<mongo_id>[a-zA-Z0-9]+)'

const matchLegacyOsmNegativeValue = /^(?<negative>-\\d+)$/
const matchLegacyOsmMongoDbValue = new RegExp(`^${matchLegacyNodes}/${matchMongoDbValue}$`)
const matchLegacyOsmElementValue = new RegExp(`^${matchLegacyNodes}/${matchLegacyValue}$`)

/** @example `-123890123890` */
export const isLegacyOsmNegativeValue = (x: string): x is LegacyOsmId.NegativeOsmValue => matchLegacyOsmNegativeValue.test(x)
/** @example  `nodes/123890123890` */
export const isLegacyMongoDbValue = (x: string): x is LegacyOsmId.MongoDbOsmValue => matchLegacyOsmMongoDbValue.test(x)
/** @example `nodes/-123890123890` || `nodes/123890123890` */
export const isLegacyOsmElementValue = (x: string): x is LegacyOsmId.LegacyOsmElementValue => matchLegacyOsmElementValue.test(x)

/**
 * Checks if a string conforms the **legacy** OSM address format of
 * - {@link LegacyOsmId.MongoDbOsmValue} (ex: `nodes/2005281859/`)
 * - {@link LegacyOsmId.LegacyOsmElementValue} (ex: `nodes/-123890123890'`, `nodes/123890123890`)
 * - {@link LegacyOsmId.NegativeOsmValue} (ex: `-123890123890`)
 *
 * additional checking for canonical formats can be done with {@link isOSMId}
 */
export const isLegacyOSMId = (x: string): x is LegacyOsmId.AnyLegacyOsmId => {
  if (isLegacyMongoDbValue(x)) {
    return true
  }

  if (isLegacyOsmElementValue(x)) {
    return true
  }

  if (isLegacyOsmNegativeValue(x)) {
    return true
  }

  return false
}
