import { useRouter } from "next/router";
import MappingEventWelcomeDialog from "~/needs-refactoring/components/MappingEvents/MappingEventWelcomeDialog";
import { getLayout } from "~/components/layouts/DefaultLayout";

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
