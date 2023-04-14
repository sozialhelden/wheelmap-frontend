import React, { ReactElement } from "react";
import { useRouter } from "next/router";
import { useCurrentApp } from "../../lib/context/AppContext";
import { fixtureDivStyle } from "../../lib/fixtures/mocks/styles";
import { BERLIN } from "../../lib/fixtures/mocks/relations/berlin";
import Layout from "../../components/App/Layout";

function RelationPage() {
  const router = useRouter();
  const { id } = router.query;
  const app = useCurrentApp();

  return (
    <>
      <div style={fixtureDivStyle}>
        Relation: {id}
        <pre>{JSON.stringify(BERLIN, null, 2)}</pre>
      </div>
      ;
    </>
  );
}

RelationPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default RelationPage;
