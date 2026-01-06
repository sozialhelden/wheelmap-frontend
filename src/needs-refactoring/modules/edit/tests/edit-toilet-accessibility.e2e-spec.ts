import { type Locator, expect, test } from "@playwright/test";
import { getButton } from "~/needs-refactoring/modules/edit/tests/utils";
import {
  goToMockedPlaceDetailPage,
  mockPlaceDetails,
  mockTranslations,
} from "~/tests/e2e/utils/mocks";
import { waitUntilMapIsLoaded } from "~/tests/e2e/utils/wait";

test.describe("Edit toilet accessibility", () => {
  let dialog: Locator;

  test.beforeEach(async ({ page }) => {
    await mockTranslations(page);
    await mockPlaceDetails(page);
    await goToMockedPlaceDetailPage(page);
    await waitUntilMapIsLoaded(page);

    await page.getByTestId("toilets-wheelchair-editor__button").click();
    dialog = page.getByTestId("toilets-wheelchair-editor__dialog");
  });

  test("dialog is rendered", async () => {
    await expect(dialog).toBeVisible();
  });

  test("confirm button changes to send after input changes", async ({
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

  // test("changes are made using the send button", async () => {
  //   //TODO
  // });

  test("dialog can be closed using the cancel button", async () => {
    await getButton(dialog, "Cancel").click();
    await expect(dialog).toBeHidden();
  });

  // test("passes WCAG accessibility check", async ({ page }) => {
  //   //TODO
  // });
});
