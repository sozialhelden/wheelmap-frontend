import { type Locator, expect, test } from "@playwright/test";
import {
  getDialog,
  getEditButton,
  getMenuItem,
  mockPlaceInfo,
} from "~/domains/edit/tests/testUtils";
import { skipOnboarding } from "../../../../tests/e2e/utils/skipOnboarding";

test.describe("Add wheelchair description in new language", () => {
  let dialog: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await skipOnboarding(page);
    await mockPlaceInfo(page);
    await getEditButton(page, "wheelchair:description").click();
    await getMenuItem(page, "new-language").click();
    dialog = await getDialog(page);
  });

  test("dialog has select box when adding a new language", async () => {
    await expect(dialog.getByRole("combobox")).toBeVisible();
  });

  test("text area is hidden before language is selected", async () => {
    const combobox = dialog.getByRole("combobox");
    const textArea = dialog.getByRole("textbox");
    await expect(textArea).toBeHidden();

    await combobox.click();
    //TODO: await expect(textArea).toBeVisible();
  });

  //TODO: test aria snapshot
  // test("matches the accessibility snapshot", async ({ page }) => {});
  //TODO: test WCAG accessibility
  // test("passes WCAG accessibility check", async ({ page }) => {
  //   expect(true).toBe(true);
  // });
});
