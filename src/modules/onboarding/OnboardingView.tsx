import type { PhotonResultFeature } from "~/needs-refactoring/lib/fetchers/fetchPhotonFeatures";
import OnboardingDialog from "~/modules/onboarding/OnboardingDialog";
import { useCallback, useState } from "react";
import { useAppState } from "~/modules/app-state/hooks/useAppState";

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
  const { appState, setAppState } = useAppState();
  const [open, setOpen] = useState(!appState.onboardingCompleted);

  const handleClose = useCallback(
    (location?: PhotonResultFeature | GeolocationPosition) => {
      setOpen(false);

      if (isPhotonFeature(location)) {
        setAppState({
          onboardingCompleted: true,
          shouldLocateUser: true,
          position: {
            latitude: location.geometry.coordinates[1],
            longitude: location.geometry.coordinates[0],
            zoom: 11,
          },
        });
        return;
      }

      if (isGeoPosition(location)) {
        setAppState({ onboardingCompleted: true, shouldLocateUser: true });
        return;
      }

      setAppState({ onboardingCompleted: true });
    },
    [setAppState],
  );

  if (!open) return null;
  return <OnboardingDialog open={open} onClose={handleClose} />;
}
