import { useRouter } from "next/router";
import React from "react";
import { getLayout } from "~/layouts/DefaultLayout";
import { StyledReportView } from "~/needs-refactoring/components/CombinedFeaturePanel/ReportView";
import { log } from "~/needs-refactoring/lib/util/logger";

function ReportExternalPage() {
  const router = useRouter();
  const { placeType, id } = router.query;

  log.log(router.query);
  return (
    <StyledReportView>
      <h1>Report External Page</h1>
      <h2>{`id: ${id}, placeType: ${placeType}`}</h2>
    </StyledReportView>
  );
}

export default ReportExternalPage;

ReportExternalPage.getLayout = getLayout;
