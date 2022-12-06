import { Button } from "@blueprintjs/core";
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
import useSWRWithErrorToast from "../../../lib/fetchers/useSWRWithErrorToast";

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
  const features = useSWR([app.tokenString, ids], fetchMultipleFeatures);
  //TODO test useSWRWithErrorToast and check TypeError
  // const features = useSWRWithErrorToast(
  //   {
  //     summary: (error: Error) => <>An error occured: {error.name}</>,
  //     instructions: (error: Error) => (
  //       <p>
  //         Report this error:
  //         <Button
  //           className="bp4-button .bp4-small"
  //           rightIcon="arrow-right"
  //           text="Report!"
  //           intent="success"
  //         ></Button>
  //       </p>
  //     ),
  //     details: (error: Error) => (
  //       <>
  //         <>{error && JSON.stringify(error.message?, null, 2)}</>
  //         <>{error && JSON.stringify(error.stack?, null, 2)}</>
  //       </>
  //     ),
  //   },
  //   [(app.tokenString, ids)],
  //   fetchMultipleFeatures,
  //   {}
  // );

  return (
    <Toolbar>
      <CombinedFeaturePanel features={features.data || []} />
    </Toolbar>
  );
}

CompositeFeaturesPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
