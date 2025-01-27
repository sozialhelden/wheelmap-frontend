import type { ReactElement } from "react";
import { t } from "ttag";
import PlaceLayout from "../../../../components/CombinedFeaturePanel/PlaceLayout";
import { useAppContext } from "../../../../lib/context/AppContext";
import { ReportOSM } from "./osm-position";

const makeTitle = (appName: string) =>
  t`Most places on ${appName} come from OpenStreetMap.`;
const subtitle = t`You can change this place's information on OpenStreetMap directly`;

function ReportOSMComment() {
  const app = useAppContext();

  return (
    <ReportOSM
      title={makeTitle(app?.name ?? "Wheelmap.org")}
      subtitle={subtitle}
    />
  );
}

ReportOSMComment.getLayout = function getLayout(page: ReactElement) {
  return <PlaceLayout>{page}</PlaceLayout>;
};

export default ReportOSMComment;
