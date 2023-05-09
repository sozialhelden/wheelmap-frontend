import { uniqBy } from "lodash";
import OSMFeature from "../../../../lib/model/osm/OSMFeature";
import { getWikipediaLemma } from "../getWikipediaLemma";
import WikipediaLink from "../WikipediaLink";
import WikidataEntityImage from "./WikidataEntityImage";
import WikimediaCommonsImage from "./WikimediaCommonsImage";

export default function FeatureImage({ feature }: { feature: OSMFeature }) {
  const imageStyle = {
    margin: "0 0 0 1rem",
    maxHeight: "3rem",
    maxWidth: "3rem",
    borderRadius: '0.125rem',
  };

  const links = uniqBy(
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
    ],
    (link) => getWikipediaLemma(feature, link.prefix)
  );

  return (
    <>
      <WikipediaLink feature={feature}>
        <WikidataEntityImage feature={feature} style={imageStyle} verb="P18" />
      </WikipediaLink>

      {links.map((link) => (
        <WikipediaLink feature={feature} prefix={link.prefix} key={link.prefix}>
          <WikidataEntityImage feature={feature} style={imageStyle} {...link} />
        </WikipediaLink>
      ))}

      <WikimediaCommonsImage
        fileName={feature.properties.image}
        style={imageStyle}
      />
    </>
  );
}
