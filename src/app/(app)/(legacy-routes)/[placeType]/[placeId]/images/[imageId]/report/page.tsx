"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAppStateAwareRouter } from "~/modules/app-state/hooks/useAppStateAwareRouter";

/**
 * @legacy-route /:placeType/:placeId/images/:imageId/report -> /:placeType/:placeId/images/:imageId
 */
export default function ShowReportPage() {
  const { replace } = useAppStateAwareRouter();
  const pathName = usePathname();

  useEffect(() => {
    replace(pathName.replace("/report", ""));
  }, []);
}
