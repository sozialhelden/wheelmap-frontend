import { onboardingCopy } from "~/modules/onboarding/onboarding-copy";

export type OnboardingCopyOverrides = {
  productName?: string;
  settingsUrl?: string;
};

const DEFAULT_SETTINGS_URL = "about:blank";
const DEFAULT_PRODUCT_NAME = "Wheelmap";

// Build onboarding copy strings without React hooks so e2e tests can assert
// against the same text as the UI.
export function buildOnboardingCopy(overrides: OnboardingCopyOverrides = {}) {
  const productName = overrides.productName ?? DEFAULT_PRODUCT_NAME;
  const settingsUrl = overrides.settingsUrl ?? DEFAULT_SETTINGS_URL;

  return {
    onboardingHeading: onboardingCopy.onboardingHeading(productName),
    startButtonText: onboardingCopy.startButtonText,
    explanation: onboardingCopy.explanation,
    hint: onboardingCopy.hint(settingsUrl),
    acceptButtonText: onboardingCopy.acceptButtonText,
    rejectButtonText: onboardingCopy.rejectButtonText,
    offlineHeading: onboardingCopy.offlineHeading,
    offlineText: onboardingCopy.offlineText(productName),
  } as const;
}
