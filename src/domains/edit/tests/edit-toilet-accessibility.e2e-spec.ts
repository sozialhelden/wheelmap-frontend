import { type Locator, expect, test } from "@playwright/test";
import {
  getButton,
  getDialog,
  getEditButton,
  setupPage,
} from "~/domains/edit/tests/utils";

test.describe("Edit toilet accessibility", () => {
  let dialog: Locator;

  test.beforeEach(async ({ page }) => {
    await setupPage(page);
    await getEditButton(page, "toilets:wheelchair").click();
    dialog = await getDialog(page);
  });

  test("dialog is rendered", async () => {
    await expect(dialog).toBeVisible();
  });

  test("dialog content is keyboard navigable", async () => {
    //TODO
  });

  test("radios are clickable & confirm button changes to send after input changes", async ({
    page,
  }) => {
    await expect(getButton(dialog, "Confirm")).toBeVisible();

    const yesRadio = page.locator("form svg").first();
    const noRadio = page.locator("form svg").nth(2);

    await expect(yesRadio).toBeVisible();
    await expect(noRadio).toBeVisible();

    await noRadio.click();
    await expect(getButton(dialog, "Send")).toBeVisible();
  });

  test("changes are made using the send button", async () => {
    //TODO
  });

  test("dialog can be closed using the cancel button", async () => {
    await getButton(dialog, "Cancel").click();
    await expect(dialog).toBeHidden();
  });

  test("passes WCAG accessibility check", async ({ page }) => {
    //TODO
  });
});
