import { useRouter } from "next/router";
import useSWR from "swr";
import Layout from "../../../components/App/Layout";
import MappingEventPanel from "../../../components/MappingEvents/MappingEventPanel";
import { useCurrentAppToken } from "../../../lib/context/AppContext";
import fetchMappingEvent from "../../../lib/fetchers/fetchMappingEvent";
import { MappingEventMetadata } from "../../../components/MappingEvents/MappingEventMetadata";

export default function() {
  const router = useRouter();
  const { id } = router.query;
  const appToken = useCurrentAppToken();

  const { data: mappingEvent, isValidating, error } = useSWR(
    [appToken, id],
    fetchMappingEvent
  );

  return (
    <>
      <Layout>
        {mappingEvent && (
          <>
            <MappingEventMetadata mappingEvent={mappingEvent} />
            <MappingEventPanel mappingEvent={mappingEvent} />
          </>
        )}
      </Layout>
    </>
  );
}
