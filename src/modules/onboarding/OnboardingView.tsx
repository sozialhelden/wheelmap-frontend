import {
  isFirstStart,
  saveState,
} from "~/needs-refactoring/lib/util/savedState";
import type { PhotonResultFeature } from "~/needs-refactoring/lib/fetchers/fetchPhotonFeatures";
import OnboardingDialog from "~/modules/onboarding/OnboardingDialog";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

function isPhotonFeature(
  location?: PhotonResultFeature | GeolocationPosition,
): location is PhotonResultFeature {
  return !!location && "geometry" in location && !!location.geometry;
}

function isGeoPosition(
  location?: PhotonResultFeature | GeolocationPosition,
): location is GeolocationPosition {
  return !!location && "coords" in location;
}

export default function OnboardingView() {
  const router = useRouter();
  const [open, setOpen] = useState(isFirstStart());

  const handleClose = useCallback(
    (location?: PhotonResultFeature | GeolocationPosition) => {
      setOpen(false);
      saveState({ onboardingCompleted: "true" });

      if (!location) {
        router.push("/");
        return;
      }

      if (isPhotonFeature(location)) {
        const query = `?lat=${location.geometry.coordinates[1]}&lon=${location.geometry.coordinates[0]}&zoom=11`;
        router.push(`/${query}`);
        return;
      }

      if (isGeoPosition(location)) {
        // const { latitude, longitude } = location.coords;
        // do  stuff with position
      }
    },
    [router],
  );

  if (!open) return null;
  return <OnboardingDialog onClose={handleClose} />;
}
