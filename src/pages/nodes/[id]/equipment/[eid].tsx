import { useRouter } from "next/router";
import React, { ReactElement, useState } from "react";
import Layout from "../../../../components/App/Layout";
import { CombinedFeaturePanel } from "../../../../components/CombinedFeaturePanel/CombinedFeaturePanel";
import Toolbar from "../../../../components/shared/Toolbar";
import { useCurrentApp } from "../../../../lib/context/AppContext";
import {
  useEquipmentInfo
} from "../../../../lib/fetchers/fetchOneEquipmentInfo";
import { usePlaceInfo } from "../../../../lib/fetchers/fetchOnePlaceInfo";
import MockedPOIDetails from "../../../../lib/fixtures/mocks/features/MockedPOIDetails";
// TODO clean up this page
function EquipmentInfoPage() {
  const router = useRouter();
  const { query, asPath } = router;
  const { id, eid } = query;
  const app = useCurrentApp();

  const [equipment, setEquipment] = useState(null);
  const [place, setPlace] = useState(null);

  // mocked data
  // TODO remove
  const fallbackId = "YdhxzsBRACZGcenCF";
  const equipmentInfoId = typeof eid === "string" ? eid : eid.shift();
  const placeInfoId = typeof id === "string" ? id : id.shift();

  // TODO
  // move fetching closer to render of fetched data? avoid re-rendering?
  // Implies changing CombinedFeaturePanel to fetch the data, not the page
  const fallbackEquipmentResponse = useEquipmentInfo(
    app.tokenString,
    fallbackId
  );
  const equipmentResponse = useEquipmentInfo(app.tokenString, equipmentInfoId);
  const placeResponse = usePlaceInfo(app.tokenString, placeInfoId);
  const fallbackplaceResponse = usePlaceInfo(
    app.tokenString,
    "222RZF9r2AAzqBQXh"
  );
  React.useEffect(() => {
    console.log("rendered");
    const equipment = equipmentResponse.data;
    const fallbackEquipment = fallbackEquipmentResponse.data;
    const place = placeResponse.data;
    const fallbackplace = fallbackplaceResponse.data;
    place ? setPlace(place) : setPlace(fallbackplace);
    equipment ? setEquipment(equipment) : setEquipment(fallbackEquipment);
  }, [
    fallbackEquipmentResponse,
    equipmentResponse,
    placeResponse,
    fallbackplaceResponse,
  ]);

  return (
    <>
      {equipment && (
        <Toolbar>
          <CombinedFeaturePanel
            features={[place, equipment]}
          ></CombinedFeaturePanel>
        </Toolbar>
      )}
      <MockedPOIDetails feature={equipment} description={`${asPath}`} />
    </>
  );
}

export default EquipmentInfoPage;

EquipmentInfoPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
