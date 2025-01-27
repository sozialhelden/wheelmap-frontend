import { useRouter } from "next/router";
import React from "react";
import OnboardingDialog from "./OnboardingDialog";
import { saveState } from "../../lib/util/savedState";
import type { PhotonResultFeature } from "../../lib/fetchers/fetchPhotonFeatures";

export default function OnboardingView() {
  const router = useRouter();
  const handleClose = React.useCallback(
    (location?: PhotonResultFeature) => {
      saveState({ onboardingCompleted: "true" });
      const query = location
        ? `?lat=${location.geometry.coordinates[1]}&lon=${location.geometry.coordinates[0]}&zoom=11`
        : "";
      router.push(`/${query}`, undefined, { shallow: true });
    },
    [router],
  );

  return <OnboardingDialog onClose={handleClose} />;
}
