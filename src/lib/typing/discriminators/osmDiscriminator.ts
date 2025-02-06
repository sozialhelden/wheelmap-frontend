import type { AccessibilityCloudRDFType } from "../../model/typing/AccessibilityCloudTypeMapping";
import type {
  AnyOSMId,
  LegacyOsmId,
  OSMElementType,
  OSMIdWithTableAndContextNames,
  OSMIdWithTypeAndTableName,
  OSMRDFContextName,
  OSMTypedId,
  OSMTypedId_Deprecated,
} from "../brands/osmIds";

const matchNumber = "(?<value>\\d+)";
const matchElementType = "(?<element>node|way|relation)";
const matchTableName = "(?<table>[\\w\\d_-]+)";
const matchRdfContext = "(?<rdf>osm(?:-inhouse)?)";
const matchSeperator = "[:/]";

const matchElementValueLegacy = new RegExp(
  `^${matchElementType}${matchSeperator}${matchNumber}$`,
);
const matchElementValue = new RegExp(
  `^${matchElementType}${matchSeperator}${matchNumber}$`,
);
const matchTableElementValue = new RegExp(
  `^${matchTableName}${matchSeperator}${matchElementType}${matchSeperator}${matchNumber}$`,
);
const matchRdfTableElementValue = new RegExp(
  `^${matchRdfContext}:${matchTableName}/${matchElementType}/${matchNumber}$`,
);

export const isOSMTypedId = (x: string): x is OSMTypedId =>
  matchElementValue.test(x);
export const isOSMIdWithTypeAndTableName = (
  x: string,
): x is OSMIdWithTypeAndTableName => matchTableElementValue.test(x);
export const isOSMIdWithTableAndContextName = (
  x: string,
): x is OSMIdWithTableAndContextNames => matchRdfTableElementValue.test(x);

// eslint-disable-next-line @typescript-eslint/naming-convention
export const isOSMElementValue_Legacy = (
  x: string,
): x is OSMTypedId_Deprecated => matchElementValueLegacy.test(x);

/**
 * Checks if a string conforms the OSM address format of
 * - {@link OSMTypedId}
 * - {@link OSMIdWithTypeAndTableName}
 * - {@link OSMIdWithTableAndContextNames}
 * - {@link OSMTypedId_Deprecated}
 *
 * additional checking for legacy formats can be done with {@link isLegacyOSMId}
 */
export const isOSMId = (x: string): x is AnyOSMId => {
  if (isOSMTypedId(x)) {
    return true;
  }

  if (isOSMIdWithTypeAndTableName(x)) {
    return true;
  }
  if (isOSMIdWithTableAndContextName(x)) {
    return true;
  }

  // keeping it right here, it's legacy, but not fully deprecated yet
  return isOSMElementValue_Legacy(x);
};

/**
 * Extracts RDF components from an OSM id in an object format
 */
export const getOSMRDFComponents = (osmId: OSMIdWithTableAndContextNames) => {
  const match = osmId.match(matchRdfTableElementValue);
  // match has to exist, otherwise the entry type was wrong
  const { rdf, table, element, value } = match?.groups as {
    rdf: OSMRDFContextName;
    table: AccessibilityCloudRDFType;
    element: OSMElementType;
    value: string;
  };
  return {
    source: osmId,
    components: [rdf, table, element, value] as const,
    properties: {
      rdf,
      table,
      element,
      value,
    },
  };
};

const matchLegacyNodes = "(?<nodes>nodes)";
const matchLegacyValue = "(?<positive>\\d+)|(?<negative>-\\d+)";
const matchMongoDbValue = "(?<mongo_id>[a-zA-Z0-9]+)";

const matchLegacyOsmNegativeValue = /^(?<negative>-\\d+)$/;
const matchLegacyOsmMongoDbValue = new RegExp(
  `^${matchLegacyNodes}/${matchMongoDbValue}$`,
);
const matchLegacyOsmElementValue = new RegExp(
  `^${matchLegacyNodes}/${matchLegacyValue}$`,
);

/** @example `-123890123890` */
export const isLegacyOsmNegativeValue = (
  x: string,
): x is LegacyOsmId.NegativeOsmValue => matchLegacyOsmNegativeValue.test(x);
/** @example  `nodes/123890123890` */
export const isLegacyMongoDbValue = (
  x: string,
): x is LegacyOsmId.MongoDbOsmValue => matchLegacyOsmMongoDbValue.test(x);

/** @example `nodes/-123890123890` || `nodes/123890123890` */
export const isLegacyOsmElementValue = (
  x: string,
): x is LegacyOsmId.LegacyOsmElementValue => matchLegacyOsmElementValue.test(x);

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
    return true;
  }

  if (isLegacyOsmElementValue(x)) {
    return true;
  }

  if (isLegacyOsmNegativeValue(x)) {
    return true;
  }

  return false;
};
