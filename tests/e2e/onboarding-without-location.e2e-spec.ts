import { expect, test } from "./setup/test-fixture";

test("has title", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Wheelmap/);
});

const dialogSelector = 'dialog[data-state="open"]';

async function waitForDialogToBeStable(page) {
  const dialog = await page.$(dialogSelector);
  // Needed to wait for the dialog to be fully opaque/non-transparent before running the accessibility scan
  await dialog?.waitForElementState("stable");
}

test.describe("onboarding dialog", () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto("/");
  });

  test("has a logo", async ({ page }) => {
    await expect(
      page.getByRole("dialog").getByLabel("Wheelmap logo"),
    ).toBeVisible();
  });

  test("has 4 accessibility examples", async ({ page }) => {
    await expect(page.getByRole("term")).toHaveCount(4);
    await expect(page.getByRole("definition")).toHaveCount(4);
  });

  test("matches a snapshot", async ({ page }) => {
    await waitForDialogToBeStable(page);
    await expect(page.getByRole("dialog")).toMatchAriaSnapshot(`
      - dialog "Welcome to Wheelmap!":
        - img "Wheelmap logo"
        - heading "Welcome to Wheelmap!" [level=1]
        - paragraph:
          - text: "Mark and find wheelchair accessible places — worldwide and for free. It’s easy with our traffic light system:"
          - list:
            - listitem:
              - figure "Fully wheelchair accessible Entrance has no steps, important areas are accessible without steps.":
                - img "green map marker"
                - term: Fully wheelchair accessible
                - definition: Entrance has no steps, important areas are accessible without steps.
            - listitem:
              - figure "Partially wheelchair accessible Entrance has one step with max. 7 cm height, most areas are without steps.":
                - img "orange map marker"
                - term: Partially wheelchair accessible
                - definition: Entrance has one step with max. 7 cm height, most areas are without steps.
            - listitem:
              - figure "Not wheelchair accessible Entrance has a high step or several steps, important areas are inaccessible.":
                - img "red map marker"
                - term: Not wheelchair accessible
                - definition: Entrance has a high step or several steps, important areas are inaccessible.
            - listitem:
              - figure "Unknown accessibility Help out by marking places!":
                - img "gray map marker"
                - term: Unknown accessibility
                - definition: Help out by marking places!
        - button "Okay, let’s go!"
    `);
  });

  test("is WCAG-compliant in the first step", async ({
    page,
    makeAxeBuilder,
  }) => {
    await waitForDialogToBeStable(page);

    const accessibilityScanResults = await makeAxeBuilder()
      .include("#onboarding-dialog-content")
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("can be closed", async ({ page }) => {
    await page.getByRole("button", { name: "Okay, let’s go!" }).click();
    await page.getByRole("button", { name: "Skip" }).click();
    await page.getByRole("button", { name: "Let’s go!" }).click();

    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});
