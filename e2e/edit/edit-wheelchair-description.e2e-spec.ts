import { expect, type Locator, test } from "@playwright/test";
import node4544823443Mock from "./mocks/node-4544823443-osm-mock.json";
import { getButton } from "./utils";
import {
  goToMockedPlaceDetailPage,
  mockPlaceDetails,
  mockTranslations,
} from "../utils/mocks";
import { waitUntilMapIsLoaded } from "../utils/wait";
import { skipOnboarding } from "../utils/control-onboarding";

const tagKey = "wheelchair:description:en";

test.describe("Edit existing wheelchair description", () => {
  let dialog: Locator;

  test.beforeEach(async ({ page }) => {
    await mockTranslations(page);
    await page.goto("/");
    await mockPlaceDetails(page);
    await skipOnboarding(page);
    await goToMockedPlaceDetailPage(page);
    await waitUntilMapIsLoaded(page);

    await page.getByTestId(`edit-description__button--${tagKey}`).click();
    await page
      .getByTestId(`edit-description__menu__current-language--${tagKey}`)
      .click();

    dialog = page.getByTestId(`edit-description__dialog--${tagKey}`);
  });

  test.skip("dialog is rendered", async () => {
    await expect(dialog).toBeVisible();
  });

  test.skip("dialog can be closed using the cancel button", async () => {
    await getButton(dialog, "Cancel").click();
    await expect(dialog).toBeHidden();
  });

  test.skip("dialog does not have select box when editing current description", async () => {
    await expect(dialog.getByRole("combobox")).toBeHidden();
  });

  // test.skip("dialog content is key board navigable", async () => {
  //   //TODO
  // });

  test.skip("text area contains description", async () => {
    const mockedEnglishDescription =
      node4544823443Mock.properties["wheelchair:description:en"];
    const textArea = dialog.getByRole("textbox");
    await expect(textArea).toHaveText(mockedEnglishDescription);
  });

  test.skip("confirm button changes to send after input changes", async () => {
    await expect(getButton(dialog, "Confirm")).toBeVisible();

    await dialog.getByRole("textbox").fill("New text input");
    await expect(getButton(dialog, "Send")).toBeVisible();
  });

  // test.skip("changes are made using the send button", async () => {
  //   //TODO
  // });

  // test.skip("passes WCAG accessibility check", async ({ page }) => {
  //   //TODO
  // });
});
