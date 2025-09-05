"use client";

import { useEffect } from "react";
import { SpinnerOverlay } from "~/components/SpinnerOverlay";
import { useAppStateAwareRouter } from "~/modules/app-state/hooks/useAppStateAwareRouter";

/**
 * @legacy-route /search -> /
 */
export default function SearchLegacyPage() {
  const { replace } = useAppStateAwareRouter();

  useEffect(() => {
    replace("/");
  }, []);

  return <SpinnerOverlay />;
}
