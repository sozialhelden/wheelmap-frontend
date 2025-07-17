import type { GeoJSONFeature } from "mapbox-gl";
import { getExternalSources } from "~/modules/map/utils/sources";
import {
  type NestedRecord,
  flattenToSearchParams,
} from "~/utils/search-params";

export function addQueryParamsToUrl(
  input: string | URL,
  query: NestedRecord<string | undefined>,
  overwriteExisting = true,
): URL {
  const url = new URL(input, window.location.origin);
  for (const [key, value] of Object.entries(flattenToSearchParams(query))) {
    if (!url.searchParams.has(key) || overwriteExisting) {
      url.searchParams.set(key, value);
    }
  }
  return url;
}

export function getFeatureUrl(
  features: GeoJSONFeature | GeoJSONFeature[],
): URL {
  // make sure a single feature array is handled like a single feature and
  // not like a composite feature
  const feature =
    Array.isArray(features) && features.length === 1 ? features[0] : features;

  if (Array.isArray(feature)) {
    const featureIds = feature
      .map((f) => {
        return f.properties?.id
          ? `amenities:${String(f.properties?.id || "").replace("/", ":")}`
          : null;
      })
      .filter(Boolean);

    return new URL(
      `/composite/${Array.from(new Set(featureIds)).join(",")}`,
      window.location.origin,
    );
  }

  const type =
    feature.layer?.id && getExternalSources(feature.layer.id)?.[0]["@type"];

  if (type === "ac:PlaceInfo") {
    return new URL(
      `/ac:PlaceInfo/${feature.properties?.id}`,
      window.location.origin,
    );
  }
  if (type === "osm:Feature") {
    return new URL(
      `/amenities/${String(feature.properties?.id || "").replace("/", ":")}`,
      window.location.origin,
    );
  }

  throw new Error("Unsupported feature type for URL generation!");
}
