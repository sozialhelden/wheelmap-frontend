/// <reference lib="dom" />

import env from './env';

export type OsmElementRef = {
  osmType: 'node' | 'way' | 'relation';
  osmId: string;
};

// accessibility.cloud PlaceInfos reference OSM elements by listing their URI in
// `properties.sameAs`, e.g. `https://openstreetmap.org/node/1743391754`.
const osmSameAsUriPattern = /^https?:\/\/(?:www\.)?(?:openstreetmap\.org|wheelmap\.org)\/(node|way|relation)\/(\d+)\/?$/;

export function parseOsmSameAsUri(uri: string): OsmElementRef | null {
  const match = uri.match(osmSameAsUriPattern);
  if (!match) {
    return null;
  }
  return { osmType: match[1] as OsmElementRef['osmType'], osmId: match[2] };
}

export function findOsmElementInSameAs(sameAs?: string[] | null): OsmElementRef | null {
  for (const uri of sameAs || []) {
    if (typeof uri !== 'string') {
      continue;
    }
    const ref = parseOsmSameAsUri(uri);
    if (ref) {
      return ref;
    }
  }
  return null;
}

async function fetchPlaceInfo(placeInfoId: string): Promise<{ properties?: { sameAs?: string[] } } | null> {
  const baseUrl = env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL;
  const appToken = env.REACT_APP_ACCESSIBILITY_CLOUD_APP_TOKEN;
  if (!baseUrl || !appToken) {
    return null;
  }
  const url = `${baseUrl}/place-infos/${encodeURIComponent(
    placeInfoId
  )}.json?appToken=${appToken}&includePlacesWithoutAccessibility=1`;
  const response = await fetch(url);
  if (!response.ok) {
    return null;
  }
  return response.json();
}

async function osmFeatureExists({ osmType, osmId }: OsmElementRef): Promise<boolean> {
  const baseUrl = env.REACT_APP_OSM_API_LEGACY_BASE_URL;
  const apiKey = env.REACT_APP_WHEELMAP_API_KEY;
  if (!baseUrl || !apiKey) {
    return false;
  }
  try {
    const response = await fetch(`${baseUrl}/api/${osmType}/${osmId}?api_key=${apiKey}`);
    return response.ok;
  } catch (error) {
    console.error(`Could not look up ${osmType}/${osmId} in the OSM API:`, error);
    return false;
  }
}

/**
 * Places that exist both in OpenStreetMap and as accessibility.cloud PlaceInfo
 * (linked via the PlaceInfo's `sameAs` property) have the OSM URL as canonical
 * URL: the place details show the merged info of both there.
 *
 * Returns the canonical place path (e.g. `/node/1743391754`) if the given
 * PlaceInfo references an OSM element that exists in the OSM API, or `null`
 * otherwise, so callers can keep showing the PlaceInfo page.
 */
export async function resolveCanonicalOsmPathForPlaceInfoId(placeInfoId: string): Promise<string | null> {
  try {
    const placeInfo = await fetchPlaceInfo(placeInfoId);
    const osmElement = findOsmElementInSameAs(placeInfo && placeInfo.properties && placeInfo.properties.sameAs);
    if (!osmElement) {
      return null;
    }
    if (!(await osmFeatureExists(osmElement))) {
      return null;
    }
    return `/${osmElement.osmType}/${osmElement.osmId}`;
  } catch (error) {
    console.error(`Could not resolve canonical OSM URL for PlaceInfo ${placeInfoId}:`, error);
    return null;
  }
}
