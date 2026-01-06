import { type Locator, expect, test } from "@playwright/test";
import node4544823443Mock from "~/needs-refactoring/modules/edit/tests/mocks/node-4544823443-osm-mock.json";
import { getButton } from "~/needs-refactoring/modules/edit/tests/utils";
import {
  goToMockedPlaceDetailPage,
  mockPlaceDetails,
  mockTranslations,
} from "~/tests/e2e/utils/mocks";
import { waitUntilMapIsLoaded } from "~/tests/e2e/utils/wait";

const tagKey = "wheelchair:description:en";

test.describe("Edit existing wheelchair description", () => {
  let dialog: Locator;

  test.beforeEach(async ({ page }) => {
    await mockTranslations(page);
    await mockPlaceDetails(page);
    await goToMockedPlaceDetailPage(page);
    await waitUntilMapIsLoaded(page);

    await page.getByTestId(`edit-description__button--${tagKey}`).click();
    await page
      .getByTestId(`edit-description__menu__current-language--${tagKey}`)
      .click();

    dialog = page.getByTestId(`edit-description__dialog--${tagKey}`);
  });

  test("dialog is rendered", async () => {
    await expect(dialog).toBeVisible();
  });

  test("dialog can be closed using the cancel button", async () => {
    await getButton(dialog, "Cancel").click();
    await expect(dialog).toBeHidden();
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

  // test("passes WCAG accessibility check", async ({ page }) => {
  //   //TODO
  // });
});
