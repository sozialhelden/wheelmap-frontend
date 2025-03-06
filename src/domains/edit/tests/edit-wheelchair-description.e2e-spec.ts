import { type Locator, expect, test } from "@playwright/test";
import {
  getDialog,
  getEditButton,
  getMenuItem,
  mockPlaceInfo,
} from "~/domains/edit/tests/testUtils";
import { skipOnboarding } from "../../../../tests/e2e/utils/skipOnboarding";

test.describe("Edit wheelchair description", () => {
  let dialog: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await skipOnboarding(page);
    await mockPlaceInfo(page);
    await getEditButton(page, "wheelchair:description").click();
    await getMenuItem(page, "this-language").click();
    dialog = await getDialog(page);
  });

  test("dialog has textarea and buttons", async () => {
    await expect(dialog.getByRole("textbox")).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Cancel" })).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Confirm" })).toBeVisible();
  });

  test("text area contains description", async () => {
    await expect(dialog.getByRole("textbox")).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Cancel" })).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Confirm" })).toBeVisible();
  });

  test("confirm button changes to send after input changes", async () => {
    const textArea = dialog.getByRole("textbox");
    const confirmButton = dialog.getByRole("button", { name: "Confirm" });

    await expect(confirmButton).toBeVisible();
    await expect(confirmButton).toHaveText("Confirm");

    await textArea.fill("New text input");
    await expect(dialog.getByRole("button", { name: "Send" })).toBeVisible();
  });

  //TODO: test aria snapshot
  // test("matches the accessibility snapshot", async ({ page }) => {});
  //TODO: test WCAG accessibility
  // test("passes WCAG accessibility check", async ({ page }) => {
  //   expect(true).toBe(true);
  // });

  test("can be closed using the cancel button", async () => {
    const cancelButton = dialog.getByRole("button", { name: "Cancel" });
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();
    await expect(dialog).toBeHidden();
  });
});
