import React from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import CloseLink from "../../components/shared/CloseLink";
import {
  fetchOnePlaceInfo,
  usePlaceInfo,
} from "../../lib/fetchers/fetchOnePlaceInfo";
import { fetchAccessibilityCloudCategories } from "../../lib/fetchers/fetchAccessibilityCloudCategories";
import { useCurrentApp } from "../../lib/context/AppContext";
import { getData } from "../../lib/fetchers/fetchWithSWR";
import Layout from "../../components/App/Layout";
import { ReactElement } from "react";
import PlaceOfInterestDetails from "../../components/CombinedFeaturePanel/type-specific/poi/PlaceOfInterestDetails";
import {
  AnyFeature,
  TypeTaggedOSMFeature,
} from "../../lib/model/shared/AnyFeature";
import { fixtureDivStyle } from "../../lib/fixtures/mocks/styles";
import { CombinedFeaturePanel } from "../../components/CombinedFeaturePanel/CombinedFeaturePanel";
import Toolbar from "../../components/shared/Toolbar";

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`;
PositionedCloseLink.displayName = "PositionedCloseLink";

export default function Nodes() {
  const [feature, setFeature] = React.useState<AnyFeature | null>(null);

  const router = useRouter();
  const { id } = router.query;
  const app = useCurrentApp();
  const myFeature = getData([app.tokenString, id], fetchOnePlaceInfo);

  const myFallbackFeature = usePlaceInfo(app.tokenString, "222RZF9r2AAzqBQXh");

  React.useEffect(() => {
    myFeature && setFeature(myFeature);
    myFeature?.error && setFeature(myFallbackFeature.data);
  }, [myFeature]);

  return (
    <>
      {feature && (
        <Toolbar>
          <CombinedFeaturePanel features={[feature]}></CombinedFeaturePanel>
        </Toolbar>
      )}
      <div style={fixtureDivStyle}>
        PlaceOfInterestDetails page
        <pre>{feature && JSON.stringify(feature, null, 2)}</pre>
      </div>
    </>
  );
}

Nodes.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
