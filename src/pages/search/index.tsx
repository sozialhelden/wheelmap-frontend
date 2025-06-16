import { getLayout } from "~/layouts/BaseMapLayout";

import { useAppStateAwareRouter } from "~/modules/app-state/hooks/useAppStateAwareRouter";

// @legacy-route
export default function Page() {
  const router = useAppStateAwareRouter();
  router.replace("/");
  return null;
}

Page.getLayout = getLayout;
