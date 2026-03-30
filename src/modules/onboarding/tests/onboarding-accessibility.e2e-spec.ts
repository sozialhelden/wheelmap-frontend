import { expect, test } from "../../../../e2e/setup/test-fixture";
import { allowGeolocation } from "~/modules/onboarding/tests/utils/geolocation";
import { buildOnboardingCopy } from "./utils/onboarding-copy";
import AxeBuilder from "@axe-core/playwright";
import {
  openOnboarding,
  resetOnboarding,
  skipFirstStep,
} from "~/modules/onboarding/tests/utils/control-onboarding";

const onboardingCopy = buildOnboardingCopy();

test.describe("Onboarding Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await resetOnboarding(page);
  });

  test("Onboarding Dialog Component should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    await openOnboarding(page);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); // 4
    expect(accessibilityScanResults.violations).toEqual([]); // 5
  });

  test("Location Dialog Component should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    await allowGeolocation(page);
    await openOnboarding(page);
    await skipFirstStep(page, onboardingCopy.startButtonText);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); // 4
    expect(accessibilityScanResults.violations).toEqual([]); // 5
  });
});
