import { useRouter } from "next/router";
import { getLayout } from "~/layouts/DefaultLayout";
import MappingEventWelcomeDialog from "~/needs-refactoring/components/MappingEvents/MappingEventWelcomeDialog";

export default function Page() {
  const router = useRouter();
  const { id, invitationToken } = router.query;

  return (
    <MappingEventWelcomeDialog
      invitationToken={invitationToken && String(invitationToken)}
      mappingEventId={id && String(id)}
    />
  );
}

Page.getLayout = getLayout;
