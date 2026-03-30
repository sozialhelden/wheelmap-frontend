import type { FC } from "react";
import { MapPinOff } from "lucide-react";
import type { PhotonResultFeature } from "~/needs-refactoring/lib/fetchers/fetchPhotonFeatures";
import { useOnboardingCopy } from "~/modules/onboarding/hooks/useOnboardingCopy";
import { LocationDialogComponent } from "~/modules/onboarding/LocationDialogComponent";

export const LocationPermissionRejectedStep: FC<{
  onSubmit: (location?: PhotonResultFeature) => unknown;
}> = ({ onSubmit }) => {
  const { locationHeading, permissionRejectedText, closeDialogButtonText } =
    useOnboardingCopy();

  return (
    <LocationDialogComponent
      title={locationHeading}
      description={permissionRejectedText}
      icon={<MapPinOff size={80} color="currentColor" strokeWidth={1} />}
      actions={[
        {
          label: closeDialogButtonText,
          onClick: () => onSubmit(),
          type: "action",
        },
      ]}
    />
  );
};
