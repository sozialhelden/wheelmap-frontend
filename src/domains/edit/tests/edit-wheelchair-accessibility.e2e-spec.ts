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
    await getEditButton(page, "wheelchair:description").click();
    dialog = await getDialog(page);
  });

  test("dialog content is key board navigable", async () => {
    //TODO
  });

  test("confirm button changes to send after input changes", async () => {
    //TODO:
    await expect(dialog.getByRole("button", { name: "Confirm" })).toBeVisible();
    // select a new radio button
    await expect(dialog.getByRole("button", { name: "Send" })).toBeVisible();
  });

  //TODO: test aria snapshot
  // test("matches the accessibility snapshot", async ({ page }) => {});
  //TODO: test WCAG accessibility
  // test("passes WCAG accessibility check", async ({ page }) => {
  //   expect(true).toBe(true);
  // });
});
