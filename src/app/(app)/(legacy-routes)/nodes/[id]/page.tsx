"use client";

import { useEffect } from "react";
import { SpinnerOverlay } from "~/components/SpinnerOverlay";
import { useAppStateAwareRouter } from "~/modules/app-state/hooks/useAppStateAwareRouter";

/**
 * @legacy-route /nodes/:id -> /amenities/node/:id or /amenities/way/:id or /ac:PlaceInfo/:id
 */
export default function NodeLegacyPage({
  params: { id },
}: { params: { id: string } }) {
  const { replace } = useAppStateAwareRouter();

  useEffect(() => {
    const isOSMFeatureId = id.length > 0 && /^-?\d+$/.test(id);

    if (isOSMFeatureId) {
      if (id.startsWith("-")) {
        replace(`/amenities/way/${id}`);
        return;
      }

      replace(`/amenities/node/${id}`);
      return;
    }

    replace(`/ac:PlaceInfo/${id}`);
  }, [replace, id]);

  return <SpinnerOverlay />;
}
