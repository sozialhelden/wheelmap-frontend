import Feature from "../../../model/Feature";
import WikidataEntityImage from "./WikidataEntityImage";
import WikimediaCommonsImage from "./WikimediaCommonsImage";
import WikipediaLink from "./WikipediaLink";

export default function FeatureImage({ feature }: { feature: Feature }) {
  const imageStyle = {
    margin: "0 0 0 1rem",
    maxHeight: "5.25rem",
    maxWidth: "5.25rem",
  };

  return (
    <>
      <WikipediaLink feature={feature}>
        <WikidataEntityImage feature={feature} style={imageStyle} verb="P18" />
      </WikipediaLink>

      <WikipediaLink feature={feature} prefix="subject">
        <WikidataEntityImage
          feature={feature}
          style={imageStyle}
          prefix="subject"
          verb="P18"
        />
      </WikipediaLink>

      <WikipediaLink feature={feature} prefix="brand">
        <WikidataEntityImage
          feature={feature}
          style={imageStyle}
          prefix="brand"
          verb="P154"
        />
      </WikipediaLink>

      <WikipediaLink feature={feature} prefix="operator">
        <WikidataEntityImage
          feature={feature}
          style={imageStyle}
          prefix="operator"
          verb="P154"
        />
      </WikipediaLink>

      <WikimediaCommonsImage
        fileName={feature.properties.image}
        style={imageStyle}
      />
    </>
  );
}
