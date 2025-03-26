import useAccessibilityCloudImages from "~/lib/fetchers/ac/useAccessibilityCloudImages";
import { useWikidataImage } from "~/lib/fetchers/wikidata/useWikidataImage";
import type OSMFeature from "~/lib/model/osm/OSMFeature";

/**
 * This hook encapsulates two SWR hooks:
 * - to fetch a wikidata image (useWikidataImage)
 * - to fetch an accessibility cloud image (useAccessibilityCloudImages)
 * and returns either the url to be used in the WikidataEntityImage component or the FIRST item of a LIST of images to be used in the AccessibilityCloudEntityImage component.
 * Its intended use is where only one image should be displayed and it does not matter from which data source it stems from,
 * e.g. the list view.
 *
 * Example Usage:
 * const { wikidataImageUrl, acImage } = useImage({
 *     feature: feature,
 *   });
 *
 * */

type Params = {
  feature: OSMFeature;
};

const useImage = ({ feature }: Params) => {
  const shouldFetch = ({ criterion }) => {
    return !criterion;
  };

  const { wikidataImageUrl } = useWikidataImage({
    feature: feature,
    verb: "P18",
  });

  const { acImages } = useAccessibilityCloudImages({
    feature: feature,
    shouldFetch: shouldFetch({ criterion: wikidataImageUrl }),
  });

  const acImage = acImages[0];

  return { wikidataImageUrl, acImage };
};

export default useImage;
