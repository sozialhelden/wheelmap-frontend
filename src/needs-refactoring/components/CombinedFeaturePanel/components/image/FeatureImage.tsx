import { t } from "@transifex/native"; // TODO: Re-implement WikimediaCommonsImage support

// TODO: Re-implement WikimediaCommonsImage support
// TODO: Re-implement logo component (brand/operator/network images)

const FeatureImage = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <img
      src={imageUrl}
      alt={t("Photo of the place.")}
      style={{
        maxHeight: "100%",
        maxWidth: "100%",
        borderRadius: "0.125rem",
      }}
    />
  );
};
export default FeatureImage;

/*
 * Logo component code to be refactored and re-implemented:
 *
 * const links = React.useMemo(
 *   () =>
 *     uniqBy(
 *       [
 *         { prefix: "subject", verb: "P18" },
 *         { prefix: "brand", verb: "P154" },
 *         { prefix: "operator", verb: "P154" },
 *         { prefix: "network", verb: "P154" },
 *       ],
 *       (link) => getWikipediaLemma(feature, link.prefix),
 *     ),
 *   [feature],
 * );
 *
 * {links.map((link) => (
 *   <WikipediaLink feature={feature} key={link.prefix}>
 *     <WikidataEntityImage
 *       feature={feature}
 *       style={imageStyle(link)}
 *       {...link}
 *     />
 *   </WikipediaLink>
 * ))}
 */

/*
 * WikimediaCommonsImage code to be re-implemented:
 *
 * <WikimediaCommonsImage
 *   fileName={feature.properties.image}
 *   style={imageStyle}
 * />
 */
