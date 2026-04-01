import { expect, test } from "../setup/test-fixture";
import { allowGeolocation } from "../utils/geolocation";
import { buildOnboardingCopy } from "../utils/onboarding-copy";
import {
  openOnboarding,
  resetOnboarding,
  skipFirstOnboardingStep,
} from "../utils/control-onboarding";

const onboardingCopy = buildOnboardingCopy();

test.describe("onboarding-accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await resetOnboarding(page);
  });

  test("Onboarding Dialog Component should not have any automatically detectable accessibility issues", async ({
    page,
    makeAxeBuilder,
  }) => {
    await openOnboarding(page);
    const accessibilityScanResults = await makeAxeBuilder().analyze(); // 4
    expect(accessibilityScanResults.violations).toEqual([]); // 5
  });

  test("Location Dialog Component should not have any automatically detectable accessibility issues", async ({
    page,
    makeAxeBuilder,
  }) => {
    await allowGeolocation(page);
    await openOnboarding(page);
    await skipFirstOnboardingStep(page, onboardingCopy.startButtonText);
    const accessibilityScanResults = await makeAxeBuilder().analyze(); // 4
    expect(accessibilityScanResults.violations).toEqual([]); // 5
  });
});
