import useSWR from "swr";
import type OSMFeature from "~/needs-refactoring/lib/model/osm/OSMFeature";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type UseWikidataEntityImageProps = {
  feature: OSMFeature;
  prefix?: string;
  verb: string;
};

const makeWikiQuery = (entityId: string | number, entityVerb: string) =>
  encodeURIComponent(
    `SELECT ?o
WHERE {
    wd:${entityId} wdt:${entityVerb} ?o.
}`,
  );

/**
 * Hook to fetch Wikidata entity image URL.
 * Returns loading state and image URL if available.
 */
export function useWikidataEntityImage({
  feature,
  prefix,
  verb,
}: UseWikidataEntityImageProps) {
  const entityId =
    feature?.properties?.[prefix ? `${prefix}:wikidata` : "wikidata"];

  const url = entityId
    ? `https://query.wikidata.org/sparql?query=${makeWikiQuery(entityId, verb)}&format=json`
    : null;

  const { data, error, isLoading } = useSWR(url, fetcher);

  let imageUrl: string | null = null;
  if (data && !error) {
    try {
      const { results } = data;
      const { bindings } = results;
      const { o } = bindings[0];
      const { value } = o;
      imageUrl = `${value.replace(/^http:/, "https:")}?width=600`;
    } catch (e) {
      imageUrl = null;
    }
  }

  return {
    isLoading: isLoading && !!entityId,
    imageUrl,
    hasImage: !!imageUrl,
  };
}
