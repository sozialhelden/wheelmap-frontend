import { AlertDialog, Dialog } from "@radix-ui/themes";
import { t } from "@transifex/native";
/* eslint-disable @typescript-eslint/indent */
import type * as React from "react";
import { useCallback, useMemo, useState } from "react";
import type { PhotonResultFeature } from "../../lib/fetchers/fetchPhotonFeatures";
import { log } from "../../lib/util/logger";
import { LocationFailedStep } from "./LocationFailedStep";
import { LocationNoPermissionStep } from "./LocationNoPermissionStep";
import { LocationStep } from "./LocationStep";
import { OnboardingStep } from "./OnboardingStep";

type OnboardingState =
  | "onboarding"
  | "permission"
  | "no-permission"
  | "failed-permission";

type Props = {
  onClose: (location?: PhotonResultFeature) => void;
};

const OnboardingDialog: React.FC<Props> = ({ onClose }) => {
  const [step, setStep] = useState<OnboardingState>("onboarding");

  // simple dsa to change flow of the onboarding steps depending on what's more important
  // optional result for the permission step
  const stepFunctions = useMemo(
    () => ({
      onboardingFinished: () => {
        if (step === "onboarding") {
          setStep("permission");
        }
      },
      onPermissionGranted: () => {
        if (step === "permission") {
          onClose();
        }
      },
      onPermissionRejected: () => {
        if (step === "permission") {
          setStep("no-permission");
        }
      },
      onPermissionFailed: () => {
        if (step === "permission") {
          setStep("failed-permission");
        }
      },
      onPermissionError: (error: GeolocationPositionError) => {
        // todo: define behaviour or place it into a logger that's quiet in prod
        log.log("Something did not work quite right here", error);
        if (step === "permission") {
          setStep("failed-permission");
        }
      },
      onRejectionSubmit: (location?: PhotonResultFeature) => {
        onClose(location);
      },
      onLocationFailureResolved: (location?: PhotonResultFeature) => {
        onClose(location);
      },
    }),
    [step, onClose],
  );

  const viewSelector = useCallback(
    (state: OnboardingState) => {
      switch (state) {
        case "onboarding":
          return <OnboardingStep onClose={stepFunctions.onboardingFinished} />;
        case "permission":
          return (
            <LocationStep
              onAccept={stepFunctions.onPermissionGranted}
              onRejected={stepFunctions.onPermissionRejected}
              onFailed={stepFunctions.onPermissionFailed}
              onGeneralError={stepFunctions.onPermissionError}
            />
          );
        case "no-permission":
          return (
            <LocationNoPermissionStep
              onSubmit={stepFunctions.onRejectionSubmit}
            />
          );
        case "failed-permission":
          return (
            <LocationFailedStep
              onSubmit={stepFunctions.onLocationFailureResolved}
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
    <DialogElement.Root
      open={true}
      aria-label={t("Start screen")}
      aria-description={t("Start screen")}
    >
      <DialogElement.Content
        maxWidth={{ initial: "100vw", md: "1000px" }}
        id="onboarding-dialog-content"
      >
        {viewSelector(step)}
      </DialogElement.Content>
    </DialogElement.Root>
  );
};

export default OnboardingDialog;
