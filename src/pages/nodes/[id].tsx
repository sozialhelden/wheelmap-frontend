import { useRouter } from "next/router";

import Link from "next/link";
import styled from "styled-components";

import CloseLink from "../../components/shared/CloseLink";
import PlaceInfoPanel from "../../components/NodeToolbar/New_Components/PlaceInfoPanel";
import {
  getAccessibilityCLoudFeatureAPIURL,
  getACFeattureFetcher,
} from "../../lib/fetchers/AccessibilityCloudFeatureFetcher";
import useSWR from "swr";
import {
  fetchAccessibilityCloudCategories
} from "../../lib/fetchers/AccessibilityCloudCategoriesFetcher";

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`;
PositionedCloseLink.displayName = "PositionedCloseLink";

function getData(url, fetcher) {
  const { data, error } = useSWR(url, fetcher);
  if (error) {
    throw new Error(error);
  } else {
    return data;
  }
}

const PlaceInfoPanelPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const featureAPI = getAccessibilityCLoudFeatureAPIURL(id);
  const featureFetcher = getACFeattureFetcher();

  const catsAPI = getAccessibilityCLoudCategoriesAPIURL();
  const catsFetcher = getAccessibilityCloudCategoriesFetcher();

  const feature = getData(featureAPI, featureFetcher);
  const categories = getData(catsAPI, catsFetcher);

  // placeInfoId, feature, categories, category
  return (
    <PlaceInfoPanel
      placeInfoId={id}
      feature={feature}
      categories={categories}
      category={feature?.properties?.category}
      parentCategory={null}
    ></PlaceInfoPanel>
  );
  // <div>PlaceInfoPanel page</div>;
};

export default PlaceInfoPanelPage;
