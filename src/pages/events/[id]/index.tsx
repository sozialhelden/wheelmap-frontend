import { useRouter } from "next/router";
import { getLayout } from "../../../components/App/MapLayout";
import { MappingEventMetadata } from "../../../components/MappingEvents/MappingEventMetadata";
import MappingEventPanel from "../../../components/MappingEvents/MappingEventPanel";
import useDocumentSWR from "../../../lib/fetchers/ac/useDocumentSWR";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;

  const { data: mappingEvent } = useDocumentSWR({
    type: "ac:MappingEvent",
    _id: String(id),
    cached: false,
  });

  if (!mappingEvent) {
    return null;
  }

  return (
    <>
      <MappingEventMetadata mappingEvent={mappingEvent} />
      <MappingEventPanel mappingEvent={mappingEvent} />
    </>
  );
}

Page.getLayout = getLayout;
