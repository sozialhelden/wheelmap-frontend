import { OsmElementRef, findOsmElementInSameAs } from './osmUri';

type Options = {
  acBaseUrl: string;
  appToken: string;
  wheelmapApiBaseUrl: string;
  wheelmapApiKey: string;
};

async function fetchJson(url: string): Promise<any> {
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    return response.ok ? await response.json() : undefined;
  } catch (error) {
    console.error('Could not fetch', url, error);
    return undefined;
  }
}

/**
 * If the given accessibility.cloud place info references an OpenStreetMap element that Wheelmap
 * knows, returns the place path of that element (e.g. `/way/123`). This is the canonical URL
 * of the place, as the place info's data is shown merged into the OSM place there.
 *
 * Returns `undefined` if there is no such element, or if anything fails, so the place info can
 * still be shown on its own.
 */
export async function getCanonicalOsmPlacePath(
  placeInfoId: string,
  options: Options
): Promise<string | undefined> {
  const osmElement = await getCanonicalOsmElement(placeInfoId, options);
  return osmElement ? `/${osmElement.element}/${osmElement.id}` : undefined;
}

/** Like {@link getCanonicalOsmPlacePath}, but returns the element for router navigation. */
export async function getCanonicalOsmElement(
  placeInfoId: string,
  { acBaseUrl, appToken, wheelmapApiBaseUrl, wheelmapApiKey }: Options
): Promise<OsmElementRef | undefined> {
  const placeInfo = await fetchJson(
    `${acBaseUrl}/place-infos/${encodeURIComponent(placeInfoId)}.json?appToken=${appToken}`
  );
  const osmElement = findOsmElementInSameAs(placeInfo?.properties?.sameAs);
  if (!osmElement) {
    return undefined;
  }

  const { element, id } = osmElement;
  const osmFeature = await fetchJson(`${wheelmapApiBaseUrl}/api/${element}/${id}?api_key=${wheelmapApiKey}`);
  return osmFeature ? osmElement : undefined;
}
