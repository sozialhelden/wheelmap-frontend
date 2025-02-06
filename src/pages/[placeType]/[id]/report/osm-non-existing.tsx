import type { ReactElement } from "react";
import { t } from "ttag";
import PlaceLayout from "../../../../components/CombinedFeaturePanel/PlaceLayout";
import { ReportOSM } from "./osm-position";

const disusedUrl = "https://wiki.openstreetmap.org/wiki/Key:disused:*";
const title = t`You can remove non-existent places on OpenStreetMap.`;
const sub = t`If the place has closed permanently, you can tag the place as 'disused' on OpenStreetMap. ([Find out how](${disusedUrl}))`;

function ReportOSMNonExisting() {
  return <ReportOSM title={title} subtitle={sub} />;
}

ReportOSMNonExisting.getLayout = function getLayout(page: ReactElement) {
  return <PlaceLayout>{page}</PlaceLayout>;
};

export default ReportOSMNonExisting;
