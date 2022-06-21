import { useRouter } from "next/router";
import React from "react";
import Layout from "../../../components/App/Layout";
import MappingEventWelcomeDialog from "../../../components/MappingEvents/MappingEventWelcomeDialog";

const EventWelcome = () => {
  const router = useRouter();
  const { id, invitationToken } = router.query;

  return (
    <Layout>
      <MappingEventWelcomeDialog
        invitationToken={invitationToken && String(invitationToken)}
        mappingEventId={id && String(id)}
      />
    </Layout>
  );
};

export default EventWelcome;
