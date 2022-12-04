import { useRouter } from "next/router";
import styled from "styled-components";
import CloseLink from "../../../components/shared/CloseLink";
import { fetchAccessibilityCloudCategories } from "../../../lib/fetchers/fetchAccessibilityCloudCategories";
import { useCurrentApp } from "../../../lib/context/AppContext";
import { getData } from "../../../lib/fetchers/fetchWithSWR";
import Layout from "../../../components/App/Layout";
import { ReactElement } from "react";
import useSWR from "swr";
import { fetchMultipleFeatures } from "../../../lib/fetchers/fetchMultipleFeatures";
import Toolbar from "../../../components/shared/Toolbar";
import { CombinedFeaturePanel } from "../../../components/DetailsPanel/CombinedFeaturePanel";

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`;
PositionedCloseLink.displayName = "PositionedCloseLink";

export default function CompositeFeaturesPage() {
  const router = useRouter();
  const { ids } = router.query;
  const app = useCurrentApp();

  const categories = getData(
    [app.tokenString],
    fetchAccessibilityCloudCategories
  );

  const features = useSWR([app.tokenString, ids], fetchMultipleFeatures);

  return (
    <Toolbar>
      <CombinedFeaturePanel features={features.data} />
    </Toolbar>
  );
}

CompositeFeaturesPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
