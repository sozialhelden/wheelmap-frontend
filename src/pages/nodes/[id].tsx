import { useRouter } from "next/router";
import styled from "styled-components";
import CloseLink from "../../components/shared/CloseLink";
import PlaceInfoPanel from "../../components/NodeToolbar/New_Components/PlaceInfoPanel";
import { fetchOneAccessibilityCloudFeature } from "../../lib/fetchers/AccessibilityCloudFeatureFetcher";
import { fetchAccessibilityCloudCategories } from "../../lib/fetchers/AccessibilityCloudCategoriesFetcher";
import { useCurrentApp } from "../../lib/context/AppContext";
import { getData } from "../../lib/fetchers/fetchWithSWR";
import Layout from "../../components/App/Layout";
import { ReactElement } from "react";

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`;
PositionedCloseLink.displayName = "PositionedCloseLink";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;
  const app = useCurrentApp();

  const categories = getData(
    [app.tokenString],
    fetchAccessibilityCloudCategories
  );
  console.log(categories);

  const feature = getData(
    [app.tokenString, id],
    fetchOneAccessibilityCloudFeature
  );

  console.log(feature);
  // placeInfoId, feature, categories, category

  return (
    <PlaceInfoPanel
      placeInfoId={id}
      // feature={feature}
      // categories={categories}
      // category={feature?.properties?.category}
      // parentCategory={null}
    >
      <div>PlaceInfoPanel page</div>
    </PlaceInfoPanel>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
