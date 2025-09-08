import { t } from "@transifex/native";
import type { ReactElement } from "react";
import { useWhitelabel } from "~/hooks/useWhitelabel";
import { DefaultLayout } from "~/layouts/DefaultLayout";
import { ReportOSM } from "./osm-position";

const makeTitle = (appName: string) =>
  t("Most places on {appName} come from OpenStreetMap.", { appName });
const subtitle = t(
  `You can change this place's information on OpenStreetMap directly`,
);

function ReportOSMComment() {
  const app = useWhitelabel();

  return (
    <ReportOSM
      title={makeTitle(app?.name ?? "Wheelmap.org")}
      subtitle={subtitle}
    />
  );
}

ReportOSMComment.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default ReportOSMComment;
