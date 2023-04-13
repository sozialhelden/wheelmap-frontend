import { useRouter } from "next/router";
import styled from "styled-components";
import CloseLink from "../../components/shared/CloseLink";
import { fetchOnePlaceInfo } from "../../lib/fetchers/fetchOnePlaceInfo";
import { fetchAccessibilityCloudCategories } from "../../lib/fetchers/fetchAccessibilityCloudCategories";
import { useCurrentApp } from "../../lib/context/AppContext";
import { getData } from "../../lib/fetchers/fetchWithSWR";
import Layout from "../../components/App/Layout";
import { ReactElement } from "react";
import PlaceOfInterestDetails from "../../components/CombinedFeaturePanel/type-specific/poi/PlaceOfInterestDetails";
import { TypeTaggedOSMFeature } from "../../lib/model/shared/AnyFeature";
import { fixtureDivStyle } from "../../lib/fixtures/mocks/styles";

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
  const feature = getData([app.tokenString, id], fetchOnePlaceInfo);

  return <div style={fixtureDivStyle}>PlaceOfInterestDetails page</div>;
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
