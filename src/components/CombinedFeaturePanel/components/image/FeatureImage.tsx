import { uniqBy } from "lodash";
import React from "react";
import { useWikidataImage } from "~/lib/fetchers/wikidata/useWikidataImage";
import type OSMFeature from "../../../../lib/model/osm/OSMFeature";
import { getWikipediaLemma } from "../../../../lib/model/osm/getWikipediaLemma";
import WikipediaLink from "../WikipediaLink";
import WikidataEntityImage from "./WikidataEntityImage";
import WikimediaCommonsImage from "./WikimediaCommonsImage";

const imageStyle = (link) => ({
  maxHeight: link.prefix === "subject" ? "8rem" : "3rem",
  maxWidth: link.prefix === "subject" ? "8rem" : "3rem",
  borderRadius: "0.125rem",
});

export default function FeatureImage({ feature }: { feature: OSMFeature }) {
  const links = React.useMemo(
    () =>
      uniqBy(
        [
          {
            prefix: "subject",
            verb: "P18",
          },
          {
            prefix: "brand",
            verb: "P154",
          },
          {
            prefix: "operator",
            verb: "P154",
          },
          {
            prefix: "network",
            verb: "P154",
          },
        ],
        (link) => getWikipediaLemma(feature, link.prefix),
      ),
    [feature],
  );

  const imageUrl = useWikidataImage({ feature: feature, verb: "P18" });

  return (
    <>
      <WikipediaLink feature={feature}>
        <WikidataEntityImage
          url={imageUrl}
          style={imageStyle({ prefix: "subject" })}
        />
      </WikipediaLink>

      {links.map((link) => (
        <WikipediaLink feature={feature} prefix={link.prefix} key={link.prefix}>
          <WikidataEntityImage
            url={imageUrl}
            style={imageStyle(link)}
            {...link}
          />
        </WikipediaLink>
      ))}

      <WikimediaCommonsImage
        fileName={feature.properties.image}
        style={imageStyle({ prefix: "subject" })}
      />
    </>
  );
}
