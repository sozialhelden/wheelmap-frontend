import { useRouter } from "next/router";
import { MappingEventMetadata } from "~/needs-refactoring/components/MappingEvents/MappingEventMetadata";
import MappingEventPanel from "~/needs-refactoring/components/MappingEvents/MappingEventPanel";
import useDocumentSWR from "~/needs-refactoring/lib/fetchers/ac/useDocumentSWR";
import { getLayout } from "~/components/layouts/DefaultLayout";

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
