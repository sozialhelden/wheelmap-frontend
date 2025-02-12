import type { databaseTableNames } from "../../../components/Map/filterLayers";
import type {
  AnyOSMId,
  OSMId,
  OSMIdWithTypeAndTableName,
  OSMTypedId,
  OSMTypedId_Deprecated,
} from "../brands/osmIds";
import {
  isOSMElementValue_Legacy,
  isOSMIdWithTableAndContextName,
  isOSMIdWithTypeAndTableName,
  isOSMTypedId,
} from "../discriminators/osmDiscriminator";

type FallbackKeyName = (typeof databaseTableNames)[number];

/**
 * Normalizes a given OSM id into an RDF specific type, that can be used universally
 * @param fallback Optional fallback when the `OSMKey` cannot be derived from the id
 */
export function normalizeOSMId(osmId: OSMTypedId, key: FallbackKeyName): OSMId;
export function normalizeOSMId(
  osmId: OSMTypedId_Deprecated,
  key: FallbackKeyName,
): OSMId;
export function normalizeOSMId(osmId: OSMIdWithTypeAndTableName): OSMId;
export function normalizeOSMId(osmId: OSMId): OSMId;
export function normalizeOSMId(
  osmId: AnyOSMId,
  fallback?: FallbackKeyName,
): OSMId {
  if (isOSMIdWithTableAndContextName(osmId)) {
    return osmId;
  }

  if (isOSMIdWithTypeAndTableName(osmId)) {
    const [table, element, value] = osmId.split(/[:/]/);
    return `osm:${table}/${element}/${value}` as OSMId;
  }

  if (isOSMTypedId(osmId)) {
    if (!fallback) {
      throw new Error("Missing key name to normalize OSM id");
    }
    const [element, value] = osmId.split(/[:/]/);
    return `osm:${fallback}/${element}/${value}` as OSMId;
  }

  if (isOSMElementValue_Legacy(osmId)) {
    if (!fallback) {
      throw new Error("Missing key name to normalize OSM id");
    }
    const [element, value] = osmId.split(/[:/]/);
    return `osm:${fallback}/${element}/${value}` as OSMId;
  }
  throw new Error(
    `Fallthrough while trying to normalize OSM id: could not discriminate which id kind was given, id was: ${osmId}`,
  );
}
