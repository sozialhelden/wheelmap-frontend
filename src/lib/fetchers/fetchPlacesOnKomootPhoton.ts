import { Point } from 'geojson'
import { t } from 'ttag'

export type KomootPhotonResultProperties = {
  city?: string;
  country?: string;
  name?: string;
  osm_id?: number;
  osm_key?: string;
  osm_type?: 'N' | 'W' | 'R';
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

export type KomootPhotonResultFeature = {
  geometry: Point;
  properties: KomootPhotonResultProperties;
};

export type SearchResultCollection = {
  features: KomootPhotonResultFeature[],
  error?: any,
};

export default async function fetchPlacesOnKomootPhoton({ query, additionalQueryParameters = {} }: {
  query: string,
  additionalQueryParameters: Record<string, string | string[] | undefined> | {},
}): Promise<SearchResultCollection | undefined> {
  if (!query || query.trim().length <= 0) {
    return undefined
  }
  const languageCode = window.navigator.language.slice(0, 2)
  const supportedLanguageCodes = ['en', 'de', 'fr', 'it'] // See Photon documentation

  const queryParameters = new URLSearchParams([
    ['q', query],
    ['limit', '30'],
    ...Object.entries(additionalQueryParameters)
      .flatMap(
        ([key, stringOrStringArray]) => {
          if (stringOrStringArray === undefined) {
            return []
          }
          return (
            typeof stringOrStringArray === "string"
              ? [[key, stringOrStringArray]]
              : stringOrStringArray.map((value) => [key, value])
          )
        },
      ),
  ])

  if (supportedLanguageCodes.includes(languageCode)) {
    queryParameters.append('lang', languageCode)
  }

  const url = `https://photon.komoot.io/api?${queryParameters.toString()}`

  // For now, no location bias anymore: It seems to sort irrelevant results to the top
  // so you are not able to find New York anymore when entering 'New York', for example
  // let locationBiasedUrl = url;
  // if (typeof lat === 'number' && typeof lon === 'number') {
  //   locationBiasedUrl = `${url}&lon=${lon}&lat=${lat}`;
  // }

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(t`Could not load search results.`)
  }

  return response.json() as unknown as SearchResultCollection
}
