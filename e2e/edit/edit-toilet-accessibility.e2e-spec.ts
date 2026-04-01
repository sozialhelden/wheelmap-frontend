import { expect, type Locator, test } from "@playwright/test";
import { getButton } from "./utils";
import {
  goToMockedPlaceDetailPage,
  mockPlaceDetails,
  mockTranslations,
} from "../utils/mocks";
import { waitUntilMapIsLoaded } from "../utils/wait";
import { skipOnboarding } from "../utils/control-onboarding";

test.describe("Edit toilet accessibility", () => {
  let dialog: Locator;

  test.beforeEach(async ({ page }) => {
    await mockTranslations(page);
    await page.goto("/");
    await mockPlaceDetails(page);
    await goToMockedPlaceDetailPage(page);
    await waitUntilMapIsLoaded(page);
    await skipOnboarding(page);

    await page.getByTestId("toilets-wheelchair-editor__button").click();
    dialog = page.getByTestId("toilets-wheelchair-editor__dialog");
  });

  test.skip("dialog is rendered", async () => {
    await expect(dialog).toBeVisible();
  });

  test.skip("confirm button changes to send after input changes", async ({
    page,
  }) => {
    await expect(getButton(dialog, "Confirm")).toBeVisible();

    const yesItem = page.locator(`[data-testid="toilet-radio-yes-item"]`);
    const noItem = page.locator(`[data-testid="toilet-radio-no-item"]`);

    await expect(yesItem).toBeVisible();
    await expect(noItem).toBeVisible();

    await noItem.click();
    await expect(getButton(dialog, "Send")).toBeVisible();
  });

  // test.skip("changes are made using the send button", async () => {
  //   //TODO
  // });

  test.skip("dialog can be closed using the cancel button", async () => {
    await getButton(dialog, "Cancel").click();
    await expect(dialog).toBeHidden();
  });

  // test.skip("passes WCAG accessibility check", async ({ page }) => {
  //   //TODO
  // });
});
