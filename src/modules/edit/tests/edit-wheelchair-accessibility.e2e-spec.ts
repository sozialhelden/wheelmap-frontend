import { type Locator, expect, test } from "@playwright/test";
import {
  getButton,
  getDialog,
  getEditButton,
  setupPage,
} from "~/modules/edit/tests/utils";

test.describe("Edit wheelchair accessibility", () => {
  let dialog: Locator;

  test.beforeEach(async ({ page }) => {
    await setupPage(page);
    await getEditButton(page, "wheelchair").click();
    dialog = await getDialog(page);
  });

  test("dialog is rendered", async () => {
    await expect(dialog).toBeVisible();
  });

  // test("dialog content is key board navigable", async () => {
  //   //TODO
  // });

  test("confirm button changes to send after input changes", async ({
    page,
  }) => {
    await expect(dialog.getByRole("button", { name: "Confirm" })).toBeVisible();
    const yesItem = page.locator(`[data-testid="yes-item"]`);
    const limitedItem = page.locator(`[data-testid="limited-item"]`);
    const noItem = page.locator(`[data-testid="no-item"]`);

    await expect(yesItem).toBeVisible();
    await expect(limitedItem).toBeVisible();
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
