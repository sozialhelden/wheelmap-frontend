import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import type { PhotonResultFeature } from "~/needs-refactoring/lib/fetchers/fetchPhotonFeatures";
import {
  isFirstStart,
  saveState,
} from "~/needs-refactoring/lib/util/savedState";
import OnboardingDialog from "./OnboardingDialog";

export default function OnboardingView() {
  const router = useRouter();
  const [open, setOpen] = useState(isFirstStart());

  const handleClose = useCallback(
    (location?: PhotonResultFeature) => {
      setOpen(false);
      saveState({ onboardingCompleted: "true" });
      const query = location
        ? `?lat=${location.geometry.coordinates[1]}&lon=${location.geometry.coordinates[0]}&zoom=11`
        : "";
      router.push(`/${query}`);
    },
    [router],
  );

  if (!open) return null;

  return <OnboardingDialog onClose={handleClose} />;
}
