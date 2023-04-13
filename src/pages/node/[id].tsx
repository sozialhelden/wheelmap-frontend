import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import Layout from "../../components/App/Layout";
import { useCurrentApp } from "../../lib/context/AppContext";
import { fixtureDivStyle } from "../../lib/fixtures/mocks/styles";
import PlaceOfInterestDetails from "../../components/CombinedFeaturePanel/type-specific/poi/PlaceOfInterestDetails";
import { RossmannNode } from "../../lib/fixtures/mocks/nodes/rossmann";
import { CombinedFeaturePanel } from "../../components/CombinedFeaturePanel/CombinedFeaturePanel";
import { features } from "process";
import Toolbar from "../../components/shared/Toolbar";
const Node = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const app = useCurrentApp();

  // return <div style={fixtureDivStyle}>Node: {id}</div>;
  return (
    <>
      <Toolbar>
        <CombinedFeaturePanel features={[RossmannNode]}></CombinedFeaturePanel>
        {/* <PlaceOfInterestDetails feature={RossmannNode}></PlaceOfInterestDetails> */}
      </Toolbar>
      <div style={fixtureDivStyle}>Node: {id}</div>
    </>
  );
};

Node.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Node;
