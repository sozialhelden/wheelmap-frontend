import { type Locator, expect, test } from "@playwright/test";
import {
  getDialog,
  getEditButton,
  mockPlaceInfo,
} from "~/domains/edit/tests/testUtils";
import { skipOnboarding } from "../../../../tests/e2e/utils/skipOnboarding";

test.describe("Edit wheelchair accessibility", () => {
  let dialog: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await skipOnboarding(page);
    await mockPlaceInfo(page);
    await getEditButton(page, "wheelchair").click();
    dialog = await getDialog(page);
  });

  test("dialog is rendered", async () => {
    await expect(dialog).toBeVisible();
  });

  test("dialog content is key board navigable", async () => {
    //TODO
  });

  test("confirm button changes to send after input changes", async ({
    page,
  }) => {
    await expect(dialog.getByRole("button", { name: "Confirm" })).toBeVisible();
    const yesRadio = page.locator("form svg").first();
    const limitedRadio = page.locator("form svg").nth(2);
    const noRadio = page.locator("form svg").nth(3);

    await expect(yesRadio).toBeVisible();
    await expect(limitedRadio).toBeVisible();
    await expect(noRadio).toBeVisible();

    await noRadio.click();
    await expect(dialog.getByRole("button", { name: "Send" })).toBeVisible();
  });

  test("dialog can be closed using the cancel button", async () => {
    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).toBeHidden();
  });

  test("passes WCAG accessibility check", async ({ page }) => {
    //TODO
  });
});
