import { humanize, singularize } from "inflection";
import { t } from "ttag";
import type { OSMFeatureCollection } from "../../model/geo/AnyFeature";
import OSMFeature from "../../model/osm/OSMFeature";
import ResourceError from "../ResourceError";

export async function fetchOSMFeatureCollection([
  baseUrl,
  collectionName,
  queryParams,
]: [string, string | undefined, string]): Promise<
  OSMFeatureCollection | undefined
> {
  const url = `${baseUrl}/${collectionName}.geojson${queryParams ? `?${queryParams}` : ""}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorResponse = await response.json();
    const humanCollectionName = humanize(collectionName);
    const defaultReason = t`Sorry! There was a problem while ${humanCollectionName} from OpenStreetMap.`;
    throw new ResourceError(
      errorResponse.reason || defaultReason,
      errorResponse.details,
      response.status,
      response.statusText,
    );
  }
  return response.json();
}
