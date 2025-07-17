import useSWR from "swr";

type Props = {
  properties: Record<string, string | number>;
  verb: string;
  prefix?: string;
};

async function fetcher(url: string) {
  return fetch(url).then((r) => r.json());
}

function query(id: string | number, verb: string) {
  const query = encodeURIComponent(
    `SELECT ?o WHERE { wd:${id} wdt:${verb} ?o. }`,
  );
  return `https://query.wikidata.org/sparql?query=${query}&format=json`;
}

export function useWikidata({ properties, verb, prefix }: Props) {
  const id = prefix ? properties[`${prefix}:wikidata`] : properties.wikidata;
  return useSWR(id ? query(id, verb) : undefined, fetcher);
}

export function useWikidataImage(
  props: Omit<Props, "verb"> & { width?: number },
) {
  const { width, ...rest } = props;

  const { data, error, isLoading, mutate } = useWikidata({
    ...rest,
    verb: "P18",
  });

  const value = data?.results?.bindings[0]?.o?.value;
  const url = value && new URL(value);

  if (width) {
    url?.searchParams.set("width", `${width}px`);
  }

  return {
    error,
    isLoading,
    mutate,
    data: url?.toString(),
  };
}
