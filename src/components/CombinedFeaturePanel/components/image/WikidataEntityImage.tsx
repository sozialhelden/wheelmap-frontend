import { t } from "@transifex/native";
/* eslint-disable @next/next/no-img-element */
import { omit } from "lodash";
import { type HTMLAttributes, useMemo } from "react";
import useSWR from "swr";
import { imageFetcher } from "~/components/CombinedFeaturePanel/components/FeatureGallery";
import {
  makeImageIds,
  makeImageLocation,
} from "~/components/CombinedFeaturePanel/components/Gallery/util";
import Image from "~/components/Image";
import type { AnyFeature } from "~/lib/model/geo/AnyFeature";
import useAccessibilityCloud from "~/modules/accessibility-cloud/hooks/useAccessibilityCloud";
import type OSMFeature from "../../../../lib/model/osm/OSMFeature";

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
  const imageIds = makeImageIds(props.feature as AnyFeature);
  const { baseUrl, appToken } = useAccessibilityCloud({ cached: true });
  const { data: acData } = useSWR(
    baseUrl && appToken
      ? imageIds.map((x) =>
          makeImageLocation(baseUrl, appToken, x.context, x.id),
        )
      : null,
    imageFetcher,
  );
  const images = useMemo(
    () => acData?.flatMap((x) => x.images) ?? [],
    [acData],
  );

  if (!error && data) {
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
    } catch (e) {}
  }

  if (!images?.[0]) {
    return null;
  }

  return <Image {...props} image={images[0]} width={60} height={60} alt="" />;
}
