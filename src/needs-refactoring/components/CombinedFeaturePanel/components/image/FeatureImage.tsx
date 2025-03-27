import { uniqBy } from "lodash";
import React from "react";
import type OSMFeature from "~/needs-refactoring/lib/model/osm/OSMFeature";
import { getWikipediaLemma } from "~/needs-refactoring/lib/model/osm/getWikipediaLemma";
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

  return (
    <>
      <WikipediaLink feature={feature}>
        <WikidataEntityImage
          feature={feature}
          style={imageStyle({ prefix: "subject" })}
          verb="P18"
        />
      </WikipediaLink>

      {links.map((link) => (
        <WikipediaLink feature={feature} prefix={link.prefix} key={link.prefix}>
          <WikidataEntityImage
            feature={feature}
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
