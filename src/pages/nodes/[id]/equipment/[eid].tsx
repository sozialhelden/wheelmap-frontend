import React, { ReactElement } from "react";
import { useRouter } from "next/router";
import { fetchOneEquipmentInfo } from "../../../../lib/fetchers/fetchOneEquipmentInfo";
import { useCurrentApp } from "../../../../lib/context/AppContext";
import { fixtureDivStyle } from "../../../../lib/fixtures/mocks/styles";
import { getData } from "../../../../lib/fetchers/fetchWithSWR";
import { CombinedFeaturePanel } from "../../../../components/CombinedFeaturePanel/CombinedFeaturePanel";
import Toolbar from "../../../../components/shared/Toolbar";
import Layout from "../../../../components/App/Layout";

function EquipmentInfoPage() {
  const router = useRouter();
  const { id } = router.query;
  const app = useCurrentApp();
  const [equipment, setEquipment] = React.useState(null);
  const equipmentInfoId = typeof id === "string" ? id : id.shift();

  const fallbackId = "YdhxzsBRACZGcenCF";

  const data = getData([app.tokenString, fallbackId], fetchOneEquipmentInfo);

  React.useEffect(() => {
    data && setEquipment(data);
  }, [equipmentInfoId, data]);

  console.log("EQUZIPPPPP ", equipment);
  return (
    <>
      {equipment && (
        <Toolbar>
          <CombinedFeaturePanel features={[equipment]}></CombinedFeaturePanel>
        </Toolbar>
      )}
      <div style={fixtureDivStyle}>
        EquimentInfoPage
        <pre>{JSON.stringify(equipment, null, 2)}</pre>
      </div>
    </>
  );
}

export default EquipmentInfoPage;

EquipmentInfoPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
