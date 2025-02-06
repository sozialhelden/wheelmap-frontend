import type { LocalizedString } from "@sozialhelden/a11yjson";
import type { PhotonResultFeature } from "../../lib/fetchers/fetchPhotonFeatures";
import type {
  AnyFeature,
  TypeTaggedPhotonSearchResultFeature,
  TypeTaggedPlaceInfo,
} from "../../lib/model/geo/AnyFeature";
import getAddressString from "../../lib/model/geo/getAddressString";
import { mapOsmCollection, mapOsmType } from "./photonFeatureHelpers";

export interface EnrichedSearchResultDisplayData {
  title?: string | LocalizedString;
  address?: string | LocalizedString;
  lat: number;
  lon: number;
  extent?: [number, number, number, number];
}

export interface EnrichedSearchResult {
  "@type": "wheelmap:EnrichedSearchResult";
  displayData: EnrichedSearchResultDisplayData;
  photonResult: TypeTaggedPhotonSearchResultFeature | null;
  featureId?: string;
  osmFeatureLoading: boolean;
  osmFeature: AnyFeature | null;
  placeInfoLoading: boolean;
  placeInfo: TypeTaggedPlaceInfo | null;
}

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

export function makeStyles(result: EnrichedSearchResult) {
  if (result.photonResult) {
    return `osm-category-${result.photonResult.properties.osm_key || "unknown"}-${result.photonResult.properties.osm_value || "unknown"}`;
  }

  if (result.placeInfo) {
    return "ac-place-info";
  }

  return undefined;
}

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
