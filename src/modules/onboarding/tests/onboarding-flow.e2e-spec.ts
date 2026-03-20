import type { Page } from "@playwright/test";
import { expect, test } from "../../../../e2e/setup/test-fixture";
import { skipOnMobiles } from "../../../../e2e/utils/device";
import {
  allowGeolocation,
  denyGeolocation,
  timeoutGeolocation,
} from "~/modules/onboarding/tests/utils/geolocation";
import { buildOnboardingCopy } from "./utils/onboarding-copy";

const onboardingCopy = buildOnboardingCopy();

async function resetOnboarding(page: Page) {
  await page.addInitScript(() => {
    localStorage.removeItem("wheelmap.onboardingCompleted");
  });
}

async function openOnboarding(page: Page) {
  await page.goto("/");
  const dialog = page.getByTestId("onboarding-dialog");
  await expect(dialog).toBeVisible({ timeout: 10000 });
  return dialog;
}

async function skipFirstStep(page: Page) {
  await page
    .getByRole("button", { name: onboardingCopy.startButtonText })
    .click();
}

async function resultFromGeolocation(page: Page) {
  return await page.evaluate(
    () =>
      new Promise<string>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => resolve("ok"),
          () => resolve("error"),
        );
      }),
  );
}

// TODO: make this a real e2e test by removing geolocation stubs and using playwrights device emulation
test.describe("Onboarding flow (desktop)", () => {
  test.beforeEach(async ({ page }) => {
    skipOnMobiles();
    await resetOnboarding(page);
  });

  test("Case A: accept in dialog and browser prompt", async ({ page }) => {
    await allowGeolocation(page);
    const dialog = await openOnboarding(page);
    await skipFirstStep(page);

    await page
      .getByRole("button", { name: onboardingCopy.acceptButtonText })
      .click();

    await expect(dialog).toBeHidden({ timeout: 10000 });
    expect(await resultFromGeolocation(page)).toBe("ok");
  });

  test("Case B: decline in app dialog", async ({ page }) => {
    await denyGeolocation(page);
    const dialog = await openOnboarding(page);
    await skipFirstStep(page);

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
    await skipFirstStep(page);

    const accessButton = dialog.getByRole("button", {
      name: onboardingCopy.acceptButtonText,
    });
    // The hook retries; a third attempt should push us into the failure step.
    await accessButton.click();
    await accessButton.click();
    await accessButton.click();

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
    await skipFirstStep(page);

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
