import { useRouter } from "next/router";
import { ReactElement } from "react";
import styled from "styled-components";
import useSWR from "swr";
import Layout from "../../../components/App/Layout";
import { CombinedFeaturePanel } from "../../../components/CombinedFeaturePanel/CombinedFeaturePanel";
import CloseLink from "../../../components/shared/CloseLink";
import Toolbar from "../../../components/shared/Toolbar";
import { useCurrentApp } from "../../../lib/context/AppContext";
import { fetchMultipleFeatures } from "../../../lib/fetchers/fetchMultipleFeatures";

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`;
PositionedCloseLink.displayName = "PositionedCloseLink";

export default function CompositeFeaturesPage() {
  const router = useRouter();
  const { placeType, id } = router.query;
  const app = useCurrentApp();

  const features = useSWR(
    [app.tokenString, `${placeType}:${id}`],
    fetchMultipleFeatures
  );

  return (
    <Toolbar>
      <CombinedFeaturePanel features={features.data || []} />
    </Toolbar>
  );
}

CompositeFeaturesPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};