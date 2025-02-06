import { useEffect } from "react";
import { getLayout } from "../../../../components/App/MapLayout";
import { useAppStateAwareRouter } from "../../../../lib/util/useAppStateAwareRouter";

function EquipmentInfoPage() {
  const {
    replace,
    query: { id, eid },
  } = useAppStateAwareRouter();
}

export default EquipmentInfoPage;

EquipmentInfoPage.getLayout = getLayout;
