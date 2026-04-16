import type { FC } from "react";
import { LocateOff } from "lucide-react";
import { useOnboardingCopy } from "./hooks/useOnboardingCopy";
import { LocationDialogComponent } from "~/modules/onboarding/LocationDialogComponent";

export const LocationUnavailableStep: FC<{
  onClose: () => unknown;
  onRetry: () => unknown;
  isAcquiring: boolean;
}> = ({ onRetry, onClose, isAcquiring }) => {
  const {
    locationHeading,
    locationUnavailableText,
    closeDialogButtonText,
    retryButtonText,
  } = useOnboardingCopy();

  return (
    <LocationDialogComponent
      title={locationHeading}
      description={locationUnavailableText}
      icon={<LocateOff size={80} color="currentColor" strokeWidth={1} />}
      actions={[
        {
          label: closeDialogButtonText,
          onClick: onClose,
          type: "cancel",
        },
        {
          label: retryButtonText,
          onClick: onRetry,
          variant: "soft",
          className: isAcquiring ? "active" : undefined,
          loading: isAcquiring,
          type: "action",
        },
      ]}
    />
  );
};
