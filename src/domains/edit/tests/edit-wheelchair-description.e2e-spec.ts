import { type Locator, expect, test } from "@playwright/test";
import node4544823443Mock from "~/domains/edit/tests/mocks/node-4544823443-osm-mock.json";
import {
  getDialog,
  getEditButton,
  getMenuItem,
  mockPlaceInfo,
} from "~/domains/edit/tests/testUtils";

test.describe("Edit wheelchair description", () => {
  let dialog: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    //await skipOnboarding(page);
    await mockPlaceInfo(page);
    await page.waitForTimeout(3000);
    await getEditButton(page, "wheelchair:description").click();
    await getMenuItem(page, "this-language").click();
    dialog = await getDialog(page);
  });

  test("dialog is rendered", async () => {
    await expect(dialog).toBeVisible();
  });

  test("dialog has textarea and buttons", async () => {
    await expect(dialog.getByRole("textbox")).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Cancel" })).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Confirm" })).toBeVisible();
  });

  test("dialog does not have select box when editing current description", async () => {
    await expect(dialog.getByRole("combobox")).toBeHidden();
  });

  test("dialog content is key board navigable", async () => {
    //TODO
  });

  test("text area contains description", async () => {
    const mockedDefaultDescription =
      node4544823443Mock.properties["wheelchair:description"];
    const textArea = dialog.getByRole("textbox");
    await expect(textArea).toHaveText(mockedDefaultDescription);
  });

  test("confirm button changes to send after input changes", async () => {
    await expect(dialog.getByRole("button", { name: "Confirm" })).toBeVisible();

    await dialog.getByRole("textbox").fill("New text input");
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
