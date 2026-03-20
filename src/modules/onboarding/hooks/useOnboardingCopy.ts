import { useContext, useMemo } from "react";
import { WhitelabelContext } from "~/hooks/useWhitelabel";
import { useLocationSettingsUrl } from "~/needs-refactoring/lib/goToLocationSettings";
import { onboardingCopy } from "../onboarding-copy";
import { useProductName } from "./useProductName";

export function useOnboardingCopy() {
  const { clientSideConfiguration } = useContext(WhitelabelContext) ?? {};
  const productName = useProductName(clientSideConfiguration);
  const [settingsUrl] = useLocationSettingsUrl();

  return useMemo(
    () => ({
      onboardingHeading: onboardingCopy.onboardingHeading(productName),
      startButtonText: onboardingCopy.startButtonText,
      locationHeading: onboardingCopy.locationHeading,
      locationExplanation: onboardingCopy.locationExplanation,
      acceptButtonText: onboardingCopy.acceptButtonText,
      rejectButtonText: onboardingCopy.rejectButtonText,
      permissionRejectedText:
        onboardingCopy.permissionRejectedText(settingsUrl),
      closeDialogButtonText: onboardingCopy.closeDialogButtonText,
      retryButtonText: onboardingCopy.retryButtonText,
      locationUnavailableText:
        onboardingCopy.locationUnavailableText(productName),
    }),
    [productName, settingsUrl],
  );
}
