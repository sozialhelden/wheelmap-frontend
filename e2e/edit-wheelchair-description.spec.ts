import { expect, test } from "./lib/axe-test";
import getBaseURL from "./lib/base-url";

const baseURL = getBaseURL();

test.describe("StringFieldEditor Component", () => {
  const baseURL = getBaseURL();
  const testURL = `${baseURL}/composite/amenities:node:4544823443,buildings:way:126125230/edit/wheelchair:description?newLang=false`;

  test.beforeEach(async ({ page }) => {
    await page.goto(testURL);
  });

  test("renders the dialog with the correct title and description", async ({
    page,
  }) => {
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveText(/Editing/i);
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
    const textArea = page.getByLabel("Enter a description here");
    await expect(textArea).toBeVisible();

    await textArea.fill("This is a test description.");
    await expect(textArea).toHaveValue("This is a test description.");
  });

  test("confirm button changes to send after input change", async ({
    page,
  }) => {
    const textArea = page.getByLabel("Enter a description here");
    const saveButton = page.getByRole("button", { name: "Confirm" });
    await expect(saveButton).toBeVisible();

    await textArea.fill("Updated description");
    await expect(page.getByRole("button", { name: "Send" })).toBeVisible();
  });

  test("matches the accessibility snapshot", async ({ page }) => {
    await expect(page.getByRole("dialog")).toMatchAriaSnapshot("");
  });

  test("passes WCAG accessibility check", async ({ page, makeAxeBuilder }) => {
    await page.waitForSelector("#string-field-editor-dialog-content", {
      state: "visible",
    });

    const accessibilityScanResults = await makeAxeBuilder()
      .include("#string-field-editor-dialog-content")
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("can be closed using the cancel button", async ({ page }) => {
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});
