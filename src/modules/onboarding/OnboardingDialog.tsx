import {
  AlertDialog,
  Dialog,
} from "@radix-ui/themes"; /* eslint-disable @typescript-eslint/indent */
import type * as React from "react";
import { useCallback, useMemo, useState } from "react";
import type { PhotonResultFeature } from "~/needs-refactoring/lib/fetchers/fetchPhotonFeatures";
import { log } from "~/needs-refactoring/lib/util/logger";
import { useGeolocationPermission } from "./hooks/useGeolocationPermission";
import { LocationUnavailableStep } from "./LocationUnavailableStep";
import { LocationPermissionRejectedStep } from "./LocationPermissionRejectedStep";
import { LocationStep } from "./LocationStep";
import { OnboardingStep } from "./OnboardingStep";

/**
 * Onboarding geolocation flow:
 * - "onboarding": Intro content; proceed to permission when finished.
 * - "permission": Ask for geolocation.
 *    Success closes dialog;
 *    PERMISSION_DENIED goes to "permission-rejected";
 *    POSITION_UNAVAILABLE/TIMEOUT/Error goes to "location-unavailable".
 * - "permission-rejected": User declined; displays information about location sharing, then closes on user click.
 * - "location-unavailable": User stays here while location cannot be fetched. Retry reuses the same geolocation request;
 *    success closes, close button exits.
 */

type OnboardingState =
  | "onboarding"
  | "permission"
  | "permission-rejected"
  | "location-unavailable";

type Props = {
  onClose: (location?: PhotonResultFeature | GeolocationPosition) => void;
};

const OnboardingDialog: React.FC<Props> = ({ onClose }) => {
  const [step, setStep] = useState<OnboardingState>("onboarding");

  const { requestPermission, isAcquiring } = useGeolocationPermission({
    onSuccess: (position: GeolocationPosition) => {
      if (step === "permission" || step === "location-unavailable") {
        onClose(position);
      }
    },
    onUnavailable: () => {
      if (step === "permission") {
        setStep("location-unavailable");
      }
    },
    onReject: () => {
      setStep("permission-rejected");
    },
    onError: (error: GeolocationPositionError) => {
      log.log("Something did not work quite right here", error);
      if (step === "permission" || step === "location-unavailable") {
        setStep("location-unavailable");
      }
    },
    onFailure: () => {
      setStep("location-unavailable");
    },
  });

  const stepFunctions = useMemo(
    () => ({
      onboardingFinished: () => {
        if (step === "onboarding") {
          setStep("permission");
        }
      },
      onPermissionRejected: () => {
        if (step === "permission") {
          setStep("permission-rejected");
        }
      },
      onRetry: () => {
        requestPermission();
      },
      onRejectionSubmit: (location?: PhotonResultFeature) => {
        onClose(location);
      },
      onLocationFailureResolved: (location?: PhotonResultFeature) => {
        onClose(location);
      },
    }),
    [step, onClose, requestPermission],
  );

  const viewSelector = useCallback(
    (state: OnboardingState) => {
      switch (state) {
        case "onboarding":
          return <OnboardingStep onClose={stepFunctions.onboardingFinished} />;
        case "permission":
          return (
            <LocationStep
              onRejected={stepFunctions.onPermissionRejected}
              requestPermission={requestPermission}
              isAcquiring={isAcquiring}
            />
          );
        case "permission-rejected":
          return (
            <LocationPermissionRejectedStep
              onSubmit={stepFunctions.onRejectionSubmit}
            />
          );
        case "location-unavailable":
          return (
            <LocationUnavailableStep
              onClose={stepFunctions.onLocationFailureResolved}
              onRetry={stepFunctions.onRetry}
              isAcquiring={isAcquiring}
            />
          );
        default:
          return undefined;
      }
    },
    [stepFunctions],
  );

  const isAlert = step !== "onboarding";
  const DialogElement = isAlert ? AlertDialog : Dialog;
  return (
    <DialogElement.Root open={true}>
      <DialogElement.Content
        maxWidth={{ initial: "100vw", md: "500px" }}
        data-testid="onboarding-dialog"
        id="onboarding-dialog-content"
      >
        {viewSelector(step)}
      </DialogElement.Content>
    </DialogElement.Root>
  );
};

export default OnboardingDialog;
