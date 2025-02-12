import { getLayout } from "~/components/App/MapLayout";
import { useAppStateAwareRouter } from "~/lib/util/useAppStateAwareRouter";

export default function Page() {
  const router = useAppStateAwareRouter();
  router.replace("/");

  return <></>;
}

Page.getLayout = getLayout;
