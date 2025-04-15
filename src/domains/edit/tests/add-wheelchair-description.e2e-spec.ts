import { type Locator, expect, test } from "@playwright/test";
import node4544823443Mock from "~/domains/edit/tests/mocks/node-4544823443-osm-mock.json";
import {
  getDialog,
  getEditButton,
  getMenuItem,
  mockPlaceInfo,
} from "~/domains/edit/tests/testUtils";

test.describe("Add wheelchair description in new language", () => {
  let dialog: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    //await skipOnboarding(page);
    await mockPlaceInfo(page);
    await page.waitForTimeout(3000);
    await getEditButton(page, "wheelchair:description").click();
    await getMenuItem(page, "new-language").click();
    dialog = await getDialog(page);
  });

  test("dialog is rendered", async () => {
    await expect(dialog).toBeVisible();
  });

  test("dialog has select box when adding a new language", async () => {
    await expect(dialog.getByRole("combobox")).toBeVisible();
  });

  test("dialog content is key board navigable", async () => {
    //TODO
  });

  test("text area is hidden before language is selected", async ({ page }) => {
    const textArea = dialog.getByRole("textbox");
    await expect(textArea).toBeHidden();

    await dialog.getByRole("combobox").click();
    await page.locator("text=English").click();
    await expect(textArea).toBeVisible();
  });

  test("correct description is displayed when another language is selected", async ({
    page,
  }) => {
    const mockedEnglishDescription =
      node4544823443Mock.properties["wheelchair:description:en"];
    const mockedPortugeseDescription =
      node4544823443Mock.properties["wheelchair:description:pt"];

    const comboboxTrigger = dialog.getByRole("combobox");
    const textArea = dialog.getByRole("textbox");

    await comboboxTrigger.click();
    await page.locator("text=/^English$/ ").click();
    await expect(comboboxTrigger).toHaveText("English");
    await expect(textArea).toHaveText(mockedEnglishDescription);

    await comboboxTrigger.click();
    await page.locator("text=/^Portuguese$/").click();
    await expect(comboboxTrigger).toHaveText("Portuguese");
    await expect(textArea).toHaveText(mockedPortugeseDescription);
  });

  test("dialog can be closed using the cancel button", async () => {
    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).toBeHidden();
  });

  test("passes WCAG accessibility check", async ({ page }) => {
    //TODO
  });
});
