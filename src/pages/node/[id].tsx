import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import Layout from "../../components/App/Layout";
import { useCurrentApp } from "../../lib/context/AppContext";
import { fixtureDivStyle } from "../../lib/fixtures/mocks/styles";
import { RossmannNode } from "../../lib/fixtures/mocks/nodes/rossmann";
import { CombinedFeaturePanel } from "../../components/CombinedFeaturePanel/CombinedFeaturePanel";

import Toolbar from "../../components/shared/Toolbar";
const NodePage = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const app = useCurrentApp();

  return (
    <>
      <Toolbar>
        <CombinedFeaturePanel features={[RossmannNode]}></CombinedFeaturePanel>
      </Toolbar>
      <div style={fixtureDivStyle}>
        Node: {id}
        <pre>{JSON.stringify(RossmannNode, null, 2)}</pre>
      </div>
    </>
  );
};

NodePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default NodePage;
