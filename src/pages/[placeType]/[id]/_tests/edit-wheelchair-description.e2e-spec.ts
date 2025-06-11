import { expect, type Locator, test } from "@playwright/test";
import node4544823443Mock from "~/pages/[placeType]/[id]/_tests/mocks/node-4544823443-osm-mock.json";
import {
  getButton,
  getDialog,
  getEditButton,
  getMenuItem,
  setupPage,
} from "~/pages/[placeType]/[id]/_tests/utils";

test.describe("Edit wheelchair description", () => {
  let dialog: Locator;

  test.beforeEach(async ({ page }) => {
    await setupPage(page);
    await getEditButton(page, "wheelchair:description").click();
    await getMenuItem(page, "this-language").click();
    dialog = await getDialog(page);
  });

  test("dialog is rendered", async () => {
    await expect(dialog).toBeVisible();
  });

  test("dialog has textarea and buttons", async () => {
    await expect(dialog.getByRole("textbox")).toBeVisible();
    await expect(getButton(dialog, "Cancel")).toBeVisible();
    await expect(getButton(dialog, "Confirm")).toBeVisible();
  });

  test("dialog does not have select box when editing current description", async () => {
    await expect(dialog.getByRole("combobox")).toBeHidden();
  });

  // test("dialog content is key board navigable", async () => {
  //   //TODO
  // });

  test("text area contains description", async () => {
    const mockedEnglishDescription =
      node4544823443Mock.properties["wheelchair:description:en"];
    const textArea = dialog.getByRole("textbox");
    await expect(textArea).toHaveText(mockedEnglishDescription);
  });

  test("confirm button changes to send after input changes", async () => {
    await expect(getButton(dialog, "Confirm")).toBeVisible();

    await dialog.getByRole("textbox").fill("New text input");
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
