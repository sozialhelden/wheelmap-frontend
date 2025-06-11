import useSWR from "swr";
import useOsmApi from "~/hooks/useOsmApi";
import type {
  AnyFeature,
  OSMFeatureCollection,
} from "../../model/geo/AnyFeature";
import { fetchOSMFeatureCollection } from "./fetchOSMFeatureCollection";

// Example: http://127.0.0.1:3001/api/v1/buildings.geojson?next=toilets&lon=13.389506863843508&lat=52.51441791024004

export default function fetchNearbyFeatures([
  baseUrl,
  type,
  next,
  lon,
  lat,
  urlParams,
]: [string, string, string, string, string, string]): Promise<
  OSMFeatureCollection | undefined
> {
  return fetchOSMFeatureCollection([
    baseUrl,
    type,
    `nearest=${next}&lon=${lon}&lat=${lat}${urlParams ? `&${urlParams}` : ""}`,
  ]);
}

export function useNearbyFeatures(
  feature?: AnyFeature,
  tagFilter?: Record<string, string>,
  nearbyFeatureCollectionName = "toilets",
) {
  const osmFeature = feature?.["@type"] === "osm:Feature" ? feature : undefined;
  const acFeature = feature?.["@type"] === "ac:PlaceInfo" ? feature : undefined;

  const { baseUrl } = useOsmApi({ cached: true });
  const {
    coordinates: [longitude, latitude],
  } = osmFeature?.centroid ||
    acFeature?.geometry || { coordinates: [undefined, undefined] };
  const urlParams = tagFilter
    ? Object.entries(tagFilter)
        .map(([key, value]) => `nearest_t[${key}]=${value}`)
        .join("&")
    : "";
  const response = useSWR(
    feature &&
      baseUrl &&
      latitude &&
      longitude && [
        baseUrl,
        "buildings",
        nearbyFeatureCollectionName,
        longitude,
        latitude,
        urlParams,
      ],
    fetchNearbyFeatures,
  );
  const nearbyFeatures = response.data?.features?.map((f) => ({
    properties: {
      _id: f.properties[`nearest:${nearbyFeatureCollectionName}:id`],
      distance: f.properties[`nearest:${nearbyFeatureCollectionName}:distance`],
    },
  }));

  return {
    response,
    nearbyFeatures,
  };
}
