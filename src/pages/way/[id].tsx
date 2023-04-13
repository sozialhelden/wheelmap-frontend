import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import Layout from "../../components/App/Layout";
import { useCurrentApp } from "../../lib/context/AppContext";
import { fixtureDivStyle } from "../../lib/fixtures/mocks/styles";
import { exampleStreet } from "../../lib/fixtures/mocks/ways/exampleStreet";

const Way = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const app = useCurrentApp();

  return (
    <>
      <div style={fixtureDivStyle}>
        Way: {id}
        <pre>{JSON.stringify(exampleStreet, null, 2)}</pre>
      </div>
      ;
    </>
  );
};

Way.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Way;
