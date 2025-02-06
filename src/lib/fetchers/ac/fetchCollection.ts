import type { Geometry, Point } from "geojson";
import {
  type AccessibilityCloudRDFType,
  type AccessibilityCloudTypeMapping,
  getAccessibilityCloudCollectionName,
} from "../../model/typing/AccessibilityCloudTypeMapping";
import ResourceError from "../ResourceError";
import type { CollectionResultType } from "./CollectionResultType";
import type { ListOrFeatureCollection } from "./ListOrFeatureCollection";

type Params<RDFTypeName extends AccessibilityCloudRDFType> = {
  /** The accessibility.cloud API base URL. There are different endpoints with different caching / CDN configs. */
  baseUrl: string;
  /** The accessibility.cloud RDF type to fetch the document from, e.g. `"ac:PlaceInfo"`. */
  type: RDFTypeName;
  /**
   * URL query string. This is a string so it works as a partial cache key (when used with useSWR).
   * Usually includes an `appToken=...` parameter.
   */
  paramsString;
};
/**
 * Fetch a list of documents from the accessibility.cloud API.
 */
export async function fetchCollectionWithTypeTags<
  RDFTypeName extends AccessibilityCloudRDFType,
  DataType extends AccessibilityCloudTypeMapping[RDFTypeName],
  R extends CollectionResultType = "List",
  G extends Geometry | null = Point,
>({
  baseUrl,
  type,
  paramsString,
}: Params<RDFTypeName>): Promise<ListOrFeatureCollection<DataType, R, G>> {
  const kebabPluralName = getAccessibilityCloudCollectionName(type);
  const url = `${baseUrl}/${kebabPluralName}.json${paramsString ? `?${paramsString}` : ""}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorResponse = await response.json();
    const defaultReason = `Failed to fetch ${type} from ${baseUrl}.`;
    throw new ResourceError(
      errorResponse.reason || defaultReason,
      errorResponse.details,
      response.status,
      response.statusText,
    );
  }
  return response.json();
}
