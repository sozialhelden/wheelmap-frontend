import { t } from "@transifex/native";
/* eslint-disable @next/next/no-img-element */
import { omit } from "lodash";
import type { HTMLAttributes } from "react";
import useSWR from "swr";
import type OSMFeature from "~/needs-refactoring/lib/model/osm/OSMFeature";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Props = HTMLAttributes<HTMLImageElement> & {
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
 * Renders a React component that loads brand info from the Wikidata API (with SWR) and displays the
 * brand logo.
 */
export default function WikidataEntityImage(props: Props) {
  const { [props.prefix ? `${props.prefix}:wikidata` : "wikidata"]: entityId } =
    props.feature.properties;

  // eslint-disable-next-line react/destructuring-assignment
  const url = `https://query.wikidata.org/sparql?query=${makeWikiQuery(
    entityId,
    props.verb,
  )}&format=json`;
  const { data, error } = useSWR(entityId ? url : null, fetcher);
  if (error) return null;
  if (!data) return null;
  try {
    const { results } = data;
    const { bindings } = results;
    const { o } = bindings[0];
    const { value } = o;
    const logoUrl = `${value.replace(/^http:/, "https:")}?width=200`;

    const image = (
      <img
        {...omit(props, "feature", "prefix", "verb")}
        src={logoUrl}
        aria-label={t("Place photo")}
      />
    );
    return image;
  } catch (e) {
    return null;
  }
}
