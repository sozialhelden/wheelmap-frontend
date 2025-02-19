import type {
  EnrichedSearchResult,
  EnrichedSearchResultDisplayData,
} from "~/domains/search/types/EnrichedSearchResult";
import type { OSMIdWithTableAndContextNames } from "~/lib/typing/brands/osmIds";
import type { PhotonResultFeature } from "../../../lib/fetchers/fetchPhotonFeatures";
import getAddressString from "../../../lib/model/geo/getAddressString";

export const makeDisplayDataFromPhotonResult = (
  photonResult: PhotonResultFeature,
): EnrichedSearchResultDisplayData => {
  const { properties, geometry } = photonResult;

  const address = getAddressString({
    countryCode: properties.country,
    street: properties.street,
    house: properties.housenumber,
    postalCode: properties.postcode,
    city: properties.city,
  });

  return {
    address,
    title: properties.name || "",
    lat: geometry.coordinates[1],
    lon: geometry.coordinates[0],
    extent: properties.extent,
  };
};

export function makeFeatureId(result: EnrichedSearchResult) {
  if (result.photonResult) {
    return `${result.photonResult.properties.osm_key}:${result.photonResult.properties.osm_id}`;
  }

  if (result.placeInfo) {
    return result.placeInfo.properties._id;
  }

  console.warn("No photonResult or placeInfo found in result", result);

  return "unknown-should-not-happen";
}

const typeMap = {
  N: "node",
  W: "way",
  R: "relation",
} as const;

export function mapOsmType(feature: PhotonResultFeature) {
  return typeMap[feature.properties.osm_type || "N"] || "node";
}

const collectionMap = {
  elevator: "elevators",
  "highway:elevator": "elevators",
  building: "buildings",
  "place:house": "entrances_or_exits",
} as const;

export function mapOsmCollection(feature: PhotonResultFeature) {
  const combinedKey = `${feature.properties.osm_key}:${feature.properties.osm_value}`;
  const secondaryKey = `${feature.properties.osm_key}`;

  return (
    collectionMap[combinedKey] || collectionMap[secondaryKey] || "amenities"
  );
}

export function buildId(feature: PhotonResultFeature) {
  const osmType = mapOsmType(feature);

  if (
    feature.properties.osm_key === "place" &&
    feature.properties.osm_value !== "house"
  ) {
    return undefined;
  }

  const collection = mapOsmCollection(feature);
  return `osm:${collection}/${osmType}/${feature.properties.osm_id}` as OSMIdWithTableAndContextNames;
}

export function buildOSMUri(feature: PhotonResultFeature) {
  // do not resolve places, as these are regularly mistyped in AC
  if (feature.properties.osm_key === "place") {
    return undefined;
  }

  const osmType = mapOsmType(feature);

  return `https://openstreetmap.org/${osmType}/${feature.properties.osm_id}`;
}

export function mapResultToUrlObject(result: EnrichedSearchResult) {
  const { lat, lon, extent } = result.displayData;

  if (result.placeInfo) {
    if (result.placeInfo.properties.sameAs) {
      const osmUrl = result.placeInfo.properties.sameAs.find((url) =>
        url.startsWith("https://www.openstreetmap.org/"),
      );
      if (osmUrl) {
        return {
          pathname: osmUrl.replace("https://www.openstreetmap.org", ""),
          query: {
            q: null,
            lat,
            lon,
            extent,
          },
        };
      }
    }

    return {
      pathname: `/ac:PlaceInfo/${result.placeInfo.properties._id}`,
      query: {
        q: null,
        lat,
        lon,
        extent,
      },
    };
  }

  // no osm place was resolved
  if (result.photonResult) {
    const osmType = mapOsmType(result.photonResult);
    const collection = mapOsmCollection(result.photonResult);

    return {
      pathname: `/${collection}/${osmType}:${result.photonResult.properties.osm_id}`,
      query: {
        q: null,
        lat,
        lon,
        extent,
      },
    };
  }

  return {
    pathname: "/",
    query: {
      q: null,
    },
  };
}
