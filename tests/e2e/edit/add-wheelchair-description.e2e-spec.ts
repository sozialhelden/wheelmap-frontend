import { type Locator, expect, test } from "@playwright/test";
import node4544823443Mock from "~/tests/e2e/edit/mocks/node-4544823443-osm-mock.json";
import {
  getButton,
  getDialog,
  getEditButton,
  getMenuItem,
  selectLanguage,
  setupPage,
} from "~/tests/e2e/edit/utils";

test.describe("Add wheelchair description in new language", () => {
  let dialog: Locator;

  test.beforeEach(async ({ page }) => {
    await setupPage(page);
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

  // test("dialog content is key board navigable", async () => {
  //   //TODO
  // });

  test("text area is hidden before language is selected", async ({ page }) => {
    const textArea = dialog.getByRole("textbox");
    await expect(textArea).toBeHidden();

    await selectLanguage(page, dialog, "English");
    await expect(textArea).toBeVisible();
  });

  test("correct description is displayed when another language is selected", async ({
    page,
  }) => {
    const mockedEnglishDescription =
      node4544823443Mock.properties["wheelchair:description:en"];
    const mockedSpanishDescription =
      node4544823443Mock.properties["wheelchair:description:es"];

    const comboboxTrigger = dialog.getByRole("combobox");
    const textArea = dialog.getByRole("textbox");

    await selectLanguage(page, dialog, "English");
    await expect(comboboxTrigger).toHaveText("English");
    await expect(textArea).toHaveText(mockedEnglishDescription);

    await selectLanguage(page, dialog, "Español");
    await expect(comboboxTrigger).toHaveText("Español");
    await expect(textArea).toHaveText(mockedSpanishDescription);
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
