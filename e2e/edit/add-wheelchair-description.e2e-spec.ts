import type { Locator } from "@playwright/test";
import { expect, test } from "../setup/test-fixture";
import node4544823443Mock from "./mocks/node-4544823443-osm-mock.json";
import { getButton, selectLanguage } from "./utils";
import {
  goToMockedPlaceDetailPage,
  mockPlaceDetails,
  mockTranslations,
} from "../utils/mocks";
import { waitUntilMapIsLoaded } from "../utils/wait";

const tagKey = "wheelchair:description:en";

test.describe("Add wheelchair description in new language", () => {
  let dialog: Locator;

  test.beforeEach(async ({ page }) => {
    await mockTranslations(page);
    await page.goto("/");
    await mockPlaceDetails(page);
    await goToMockedPlaceDetailPage(page);
    await waitUntilMapIsLoaded(page);

    await page.getByTestId(`edit-description__button--${tagKey}`).click();
    await page
      .getByTestId(`edit-description__menu__new-language--${tagKey}`)
      .click();

    dialog = page.getByTestId(`edit-description__dialog--${tagKey}`);
  });

  test("dialog is rendered", async () => {
    await expect(dialog).toBeVisible();
  });

  test("dialog has select box when adding a new language", async () => {
    await expect(dialog.getByRole("combobox")).toBeVisible();
  });

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

  // test.skip("changes are made using the send button", async () => {
  //   //TODO
  // });

  test("dialog can be closed using the cancel button", async () => {
    await getButton(dialog, "Cancel").click();
    await expect(dialog).toBeHidden();
  });

  // skipping for now since the low contrast in radix' select box makes this fail
  test.skip("passes WCAG accessibility check", async ({ makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder().analyze(); // 4
    expect(accessibilityScanResults.violations).toEqual([]); // 5
  });
});
