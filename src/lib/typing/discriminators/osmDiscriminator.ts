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

export const getOSMRDFComponents = (osmId: OSMRDFTableElementValue) => {
  const match = osmId.match(matchRdfTableElementValue)
  // eslint-disable-next-line max-len, @stylistic/js/max-len
  // assert(match?.groups, 'Could not parse OSM ID: The passed ID may not conform the parsing regex, no result returned. Please ensure the given OSM ID conforms to the format `osm:[tableName]:[node|way|relation]:[numeric ID]`.')
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

export const isLegacyOsmNegativeValue = (x: string): x is LegacyOsmId.NegativeOsmValue => matchLegacyOsmNegativeValue.test(x)
export const isLegacyMongoDbValue = (x: string): x is LegacyOsmId.MongoDbOsmValue => matchLegacyOsmMongoDbValue.test(x)
export const isLegacyOsmElementValue = (x: string): x is LegacyOsmId.LegacyOsmElementValue => matchLegacyOsmElementValue.test(x)
export const isLegacyOsmId = (x: string): x is LegacyOsmId.AnyLegacyOsmId => {
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
