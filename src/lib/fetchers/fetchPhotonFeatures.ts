import { t } from "@transifex/native";
import type { Point } from "geojson";

export type PhotonResultProperties = {
  city?: string;
  country?: string;
  name?: string;
  osm_id?: number;
  osm_key?: string;
  osm_type?: "N" | "W" | "R";
  osm_value?: string;
  postcode?: string;
  countrycode?: string;
  locality?: string;
  type?: string;
  district?: string;
  state?: string;
  housenumber?: string;
  street?: string;
  extent?: [number, number, number, number];
};

export type PhotonResultFeature = {
  geometry: Point;
  properties: PhotonResultProperties;
};

export type PhotonSearchResultCollection = {
  features: PhotonResultFeature[];
  error?: unknown;
};

const baseUrl = "https://photon.komoot.io/api";

export default async function fetchPhotonFeatures({
  languageCode,
  query,
  additionalQueryParameters = {},
}: {
  query: string;
  additionalQueryParameters: Record<string, string | string[] | undefined>;
  languageCode: string;
}): Promise<PhotonSearchResultCollection | undefined> {
  if (!query || query.trim().length <= 0) {
    return undefined;
  }
  const supportedLanguageCodes = ["en", "de", "fr", "it"]; // See Photon documentation

  const queryParameters = new URLSearchParams([
    ["q", query],
    ["limit", "30"],
    ["location_bias_scale", "0.3"],
    ...Object.entries(additionalQueryParameters).flatMap(
      ([key, stringOrStringArray]) => {
        if (stringOrStringArray === undefined) {
          return [];
        }
        return typeof stringOrStringArray === "string"
          ? [[key, stringOrStringArray]]
          : stringOrStringArray.map((value) => [key, value]);
      },
    ),
  ]);

  if (supportedLanguageCodes.includes(languageCode)) {
    queryParameters.append("lang", languageCode);
  }

  const url = `${baseUrl}?${queryParameters.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(t("Could not load search results."));
  }

  return (await response.json()) as PhotonSearchResultCollection;
}
