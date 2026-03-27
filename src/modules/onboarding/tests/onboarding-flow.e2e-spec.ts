import { expect, test } from "../../../../e2e/setup/test-fixture";
import {
  allowGeolocation,
  denyGeolocation,
  resultFromGeolocation,
  timeoutGeolocation,
} from "~/modules/onboarding/tests/utils/geolocation";
import { buildOnboardingCopy } from "./utils/onboarding-copy";
import {
  openOnboarding,
  resetOnboarding,
  skipFirstStep,
} from "./utils/control-onboarding";

const onboardingCopy = buildOnboardingCopy();

// TODO: make this a real e2e test by removing geolocation stubs and using playwrights device emulation
test.describe("Onboarding Flow ", () => {
  test.beforeEach(async ({ page }) => {
    await resetOnboarding(page);
  });

  test("Case A: accept in dialog and browser prompt", async ({ page }) => {
    await allowGeolocation(page);
    const dialog = await openOnboarding(page);
    await skipFirstStep(page, onboardingCopy.startButtonText);

    await page
      .getByRole("button", { name: onboardingCopy.acceptButtonText })
      .click();

    await expect(dialog).toBeHidden({ timeout: 10000 });
    expect(await resultFromGeolocation(page)).toBe("ok");
  });

  test("Case B: decline in app dialog", async ({ page }) => {
    await denyGeolocation(page);
    const dialog = await openOnboarding(page);
    await skipFirstStep(page, onboardingCopy.startButtonText);

    await page
      .getByRole("button", { name: onboardingCopy.rejectButtonText })
      .click();

    await expect(
      page.getByText(onboardingCopy.permissionRejectedText.slice(0, 20)),
    ).toBeVisible();
    await page
      .getByRole("button", { name: onboardingCopy.closeDialogButtonText })
      .click();

    await expect(dialog).toBeHidden({ timeout: 10000 });
    expect(await resultFromGeolocation(page)).toBe("error");
  });

  test("Case C: browser allows but location unavailable", async ({ page }) => {
    await timeoutGeolocation(page);
    const dialog = await openOnboarding(page);
    await skipFirstStep(page, onboardingCopy.startButtonText);

    await page
      .getByRole("button", { name: onboardingCopy.acceptButtonText })
      .click();

    await expect(
      dialog.getByText(onboardingCopy.locationUnavailableText.slice(0, 10)),
    ).toBeVisible();
    await page
      .getByRole("button", { name: onboardingCopy.closeDialogButtonText })
      .click();

    await expect(dialog).toBeHidden({ timeout: 10000 });
    expect(await resultFromGeolocation(page)).toBe("error");
  });

  test("Case D: accept in dialog, deny browser prompt ", async ({ page }) => {
    await denyGeolocation(page);

    const dialog = await openOnboarding(page);
    await skipFirstStep(page, onboardingCopy.startButtonText);

    await page
      .getByRole("button", {
        name: onboardingCopy.acceptButtonText,
      })
      .click();

    await expect(
      page.getByText(onboardingCopy.permissionRejectedText.slice(0, 10)),
    ).toBeVisible();
    await page
      .getByRole("button", { name: onboardingCopy.closeDialogButtonText })
      .click();

    await expect(dialog).toBeHidden({ timeout: 10000 });
    expect(await resultFromGeolocation(page)).toBe("error");
  });
});
