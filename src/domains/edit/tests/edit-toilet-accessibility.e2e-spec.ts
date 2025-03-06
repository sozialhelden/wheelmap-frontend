import { type Locator, expect, test } from "@playwright/test";
import {
  getDialog,
  getEditButton,
  mockPlaceInfo,
} from "~/domains/edit/tests/testUtils";
import { skipOnboarding } from "../../../../tests/e2e/utils/skipOnboarding";

test.describe("Edit toilet accessibility", () => {
  let dialog: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await skipOnboarding(page);
    await mockPlaceInfo(page);
    await getEditButton(page, "toilets:wheelchair").click();
    dialog = await getDialog(page);
  });

  test("dialog content is keyboard navigable", async () => {
    //TODO
  });

  test("radios are clickable & confirm button changes to send after input changes", async ({
    page,
  }) => {
    await expect(dialog.getByRole("button", { name: "Confirm" })).toBeVisible();

    const yesRadio = page.locator("form svg").first();
    const noRadio = page.locator("form svg").nth(2);

    await expect(yesRadio).toBeVisible();
    await expect(noRadio).toBeVisible();

    await noRadio.click();
    await expect(dialog.getByRole("button", { name: "Send" })).toBeVisible();
  });

  //TODO: test aria snapshot
  // test("matches the accessibility snapshot", async ({ page }) => {});
  //TODO: test WCAG accessibility
  // test("passes WCAG accessibility check", async ({ page }) => {
  //   expect(true).toBe(true);
  // });
});
