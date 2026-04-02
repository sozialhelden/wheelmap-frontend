import { expect, type Locator, test } from "@playwright/test";
import { getButton } from "./utils";
import {
  goToMockedPlaceDetailPage,
  mockPlaceDetails,
  mockTranslations,
} from "../utils/mocks";
import { waitUntilMapIsLoaded } from "../utils/wait";
import { skipOnboarding } from "../utils/control-onboarding";

test.describe("Edit wheelchair accessibility", () => {
  let dialog: Locator;

  test.beforeEach(async ({ page }) => {
    await mockTranslations(page);
    await page.goto("/");
    await mockPlaceDetails(page);
    await skipOnboarding(page);
    await goToMockedPlaceDetailPage(page);
    await waitUntilMapIsLoaded(page);

    await page.getByTestId("wheelchair-editor__button").click();
    dialog = page.getByTestId("wheelchair-editor__dialog");
  });

  test.skip("a dialog is shown after clicking the edit button", async () => {
    await expect(dialog).toBeVisible();
  });

  test.skip("confirm button changes to send after input changes", async ({
    page,
  }) => {
    await expect(dialog.getByRole("button", { name: "Confirm" })).toBeVisible();
    const yesItem = dialog.getByTestId("wheelchair-editor__radio--yes");
    const limitedItem = dialog.getByTestId("wheelchair-editor__radio--limited");
    const noItem = dialog.getByTestId("wheelchair-editor__radio--no");

    await expect(yesItem).toBeVisible();
    await expect(limitedItem).toBeVisible();
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
