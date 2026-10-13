/**
 * accessibility.cloud place infos reference OpenStreetMap elements by listing their URI in
 * `properties.sameAs`, e.g. `https://openstreetmap.org/way/123`.
 *
 * These prefixes cover every spelling we've seen in the wild. The first one is the spelling
 * Wheelmap uses as key for OSM elements.
 */
export const osmSameAsUriPrefixes = [
  'https://openstreetmap.org/',
  'https://www.openstreetmap.org/',
];

export type OsmElementRef = {
  element: 'node' | 'way' | 'relation';
  id: string;
};

const osmUriPattern = /^https?:\/\/(?:www\.)?openstreetmap\.org\/(node|way|relation)\/(\d+)\/?$/;

export function parseOsmUri(uri: string): OsmElementRef | undefined {
  const match = typeof uri === 'string' ? uri.match(osmUriPattern) : null;
  if (!match) {
    return undefined;
  }
  return { element: match[1] as OsmElementRef['element'], id: match[2] };
}

export function findOsmElementInSameAs(
  sameAs: string[] | null | undefined
): OsmElementRef | undefined {
  for (const uri of sameAs || []) {
    const ref = parseOsmUri(uri);
    if (ref) {
      return ref;
    }
  }
  return undefined;
}

export function normalizedOsmUri({ element, id }: OsmElementRef): string {
  return `${osmSameAsUriPrefixes[0]}${element}/${id}`;
}

/**
 * All URIs a place info might use in `sameAs` for the given OSM element. The accessibility.cloud
 * `sameAs` filter matches exactly, so we have to query all of them.
 */
export function getOsmUriVariants({ element, id }: OsmElementRef): string[] {
  return osmSameAsUriPrefixes.map(prefix => `${prefix}${element}/${id}`);
}

/**
 * Groups place infos by the OSM elements they reference in `sameAs`, keyed by
 * {@link normalizedOsmUri}.
 */
export function groupPlaceInfosByOsmURI<T extends { properties: { sameAs?: string[] | null } }>(
  placeInfos: T[]
): Record<string, T[]> {
  const placeInfosByURI: Record<string, T[]> = {};
  for (const placeInfo of placeInfos) {
    const uris = new Set(
      (placeInfo.properties.sameAs || []).map(parseOsmUri).filter(Boolean).map(normalizedOsmUri)
    );
    uris.forEach(uri => {
      (placeInfosByURI[uri] = placeInfosByURI[uri] || []).push(placeInfo);
    });
  }
  return placeInfosByURI;
}
