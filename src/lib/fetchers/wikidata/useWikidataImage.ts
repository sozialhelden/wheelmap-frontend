import useSWR from "swr";
import type OSMFeature from "~/lib/model/osm/OSMFeature";

type Params = {
  feature: OSMFeature;
  verb: string;
  prefix?: string;
  shouldFetch?: boolean;
};

const makeWikiQuery = (entityId: string | number, entityVerb: string) =>
  encodeURIComponent(
    `SELECT ?o
WHERE {
    wd:${entityId} wdt:${entityVerb} ?o.
}`,
  );

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const useWikidataImage = ({
  feature,
  verb,
  prefix,
  shouldFetch = true,
}: Params) => {
  const { [prefix ? `${prefix}:wikidata` : "wikidata"]: entityId } =
    feature.properties;
  // eslint-disable-next-line react/destructuring-assignment
  const url = `https://query.wikidata.org/sparql?query=${makeWikiQuery(
    entityId,
    verb,
  )}&format=json`;

  const { data, error, isLoading, mutate } = useSWR(
    entityId && shouldFetch ? url : null,
    fetcher,
  );

  let wikidataImageUrl = "";

  if (!error && data) {
    try {
      const {
        results: {
          bindings: [
            {
              o: { value },
            },
          ],
        },
      } = data;
      wikidataImageUrl = `${value.replace(/^http:/, "https:")}?width=200`;
      return { wikidataImageUrl, error, isLoading, mutate };
    } catch (e) {
      console.error(e);
    }
  }

  return { wikidataImageUrl, error, isLoading, mutate };
};

export { useWikidataImage };
