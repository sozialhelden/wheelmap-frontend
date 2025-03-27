import { getLayout } from "~/components/layouts/BaseMapLayout";
import { useAppStateAwareRouter } from "~/needs-refactoring/lib/util/useAppStateAwareRouter";

// @legacy-route
export default function Page() {
  const router = useAppStateAwareRouter();
  router.replace("/");
  return null;
}

Page.getLayout = getLayout;
