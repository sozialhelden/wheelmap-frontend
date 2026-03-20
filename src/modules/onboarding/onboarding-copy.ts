import { t } from "@transifex/native"; // Pure copy definitions without hooks so they can be reused by tests and

// Pure copy definitions without hooks so they can be reused by tests and
// components. Hook-specific values (product name, settings URL) are injected via
// helper hooks.
export const onboardingCopy = {
  onboardingHeading: (productName: string) => t(`Welcome to ${productName}! }`),
  startButtonText: t("Got it!"),
  locationHeading: t("Location permissions"),
  locationExplanation: t(
    "**Wheelmap needs access to your location in order to show you the closest accessible places.**",
  ),
  acceptButtonText: t("Share my location"),
  rejectButtonText: t("Maybe later"),
  permissionRejectedText: (url: string) =>
    t(
      `Understood, Wheelmap does not access your location!   \nYou can change this in [your deviceʼs location settings](${url}).`,
    ),
  closeDialogButtonText: t("Got it!"),
  retryButtonText: t("Try again"),
  locationUnavailableText: (productName: string) =>
    t(
      `Oops, your location could not be found.  \nNo worries, you can still use all features of ${productName}.`,
    ),
};
