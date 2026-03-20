import type { FC } from "react";
import { MapPinned } from "lucide-react";
import { useOnboardingCopy } from "~/modules/onboarding/hooks/useOnboardingCopy";
import { cx } from "~/needs-refactoring/lib/util/cx";
import { LocationDialogComponent } from "~/modules/onboarding/LocationDialogComponent";

export const LocationStep: FC<{
  onRejected: () => unknown;
  isAcquiring: boolean;
  requestPermission: () => void;
}> = ({ onRejected, requestPermission, isAcquiring }) => {
  const {
    locationHeading,
    locationExplanation,
    acceptButtonText,
    rejectButtonText,
  } = useOnboardingCopy();

  return (
    <LocationDialogComponent
      title={locationHeading}
      description={locationExplanation}
      icon={<MapPinned size={80} color="currentColor" strokeWidth={1} />}
      actions={[
        {
          label: acceptButtonText,
          onClick: requestPermission,
          className: cx("accept", isAcquiring && "active"),
          loading: isAcquiring,
          type: "action",
        },
        {
          label: rejectButtonText,
          onClick: onRejected,
          variant: "soft",
          type: "cancel",
        },
      ]}
    />
  );
};
