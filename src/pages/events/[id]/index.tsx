import { useRouter } from "next/router";
import Layout from "../../../components/App/Layout";
import MappingEventToolbar from "../../../components/MappingEvents/MappingEventToolbar";

const Event = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout>
      <MappingEventToolbar mappingEventId={id && String(id)} />
    </Layout>
  );
};

export default Event;
