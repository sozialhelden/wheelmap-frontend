import { expect, test } from "./lib/axe-test";
import getBaseURL from "./lib/base-url";

test.describe("StringFieldEditor Component", () => {
  const baseURL = getBaseURL();
  const testURL = `${baseURL}/composite/amenities:node:4544823443,buildings:way:126125230/edit/wheelchair:description?newLang=false`;

  const dialogSelector = '[data-testid="string-field-editor-dialog"]';

  async function waitForDialogToBeStable(page) {
    const dialog = await page.$(dialogSelector);
    await dialog?.waitForElementState("stable");
  }

  test.beforeEach(async ({ page }) => {
    await page.goto(testURL);
    //await expect(page.getByRole("dialog")).toBeVisible();
    await waitForDialogToBeStable(page);
  });

  test("renders the dialog with correct title and description", async ({
    page,
  }) => {
    await expect(page.getByRole("dialog")).toHaveText(/Editing/i);
    await expect(page.getByRole("dialog")).toHaveText(
      /Please describe how accessible this place is for wheelchair users. Start by selecting the language for your description./i,
    );
  });

  /*test("has a working language selector when adding a new language", async ({
    page,
  }) => {
    const languageSelector = page.getByLabel("Select a language");
    await expect(languageSelector).toBeVisible();

    await languageSelector.click();
    await expect(page.getByRole("option")).toHaveCount(10); // Example: Check if at least 10 languages are listed
  });*/

  test("textarea is visible and can be typed into", async ({ page }) => {
    const textArea = page.getByTestId("string-field-editor-text-area");
    await expect(textArea).toBeVisible();

    await textArea.fill("This is a test description.");
    await expect(textArea).toHaveValue("This is a test description.");
  });

  test("confirm button changes to send after input change", async ({
    page,
  }) => {
    const textArea = page.getByTestId("string-field-editor-text-area");
    const saveButton = page.getByRole("button", { name: "Confirm" });
    await expect(saveButton).toBeVisible();

    await textArea.fill("Updated description");
    await expect(page.getByRole("button", { name: "Send" })).toBeVisible();
  });

  test("matches the accessibility snapshot", async ({ page }) => {
    await waitForDialogToBeStable(page);
    await expect(page.getByRole("dialog")).toMatchAriaSnapshot(`
      - dialog "Editing wheelchair:description":
        - heading "Sozialhelden e.V., Non-Government Organisation" [level=1]:
          - button:
            - img
            - img
        - link
        - heading "Editing wheelchair:description" [level=1]
        - text: Below you can edit this description. Add information that you find useful.
        - textbox "Enter a description here": Rollstuhlgerechtes Gebäude, rollstuhlgerechte Kantine, geräumige weitere WCs (mit 'genderneutral'-Symbol gekennzeichnet)
        - link "Cancel":
          - button "Cancel"
        - link "Confirm":
          - button "Confirm"
    `);
  });

  /* test("passes WCAG accessibility check", async ({ page, makeAxeBuilder }) => {
    await waitForDialogToBeStable(page);
    const accessibilityScanResults = await makeAxeBuilder()
      .include("#string-field-editor-dialog-content")
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  }); */

  test("can be closed using the cancel button", async ({ page }) => {
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.locator(dialogSelector)).not.toBeVisible();
  });
});
