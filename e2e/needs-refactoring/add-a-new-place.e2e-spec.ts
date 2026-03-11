import { expect, test } from "@playwright/test"; // Navigation.tsx hides the primary "Add a new place" link behind a hamburger menu on

// Navigation.tsx hides the primary "Add a new place" link behind a hamburger menu on
// viewports narrower than 480px (SMALL_VIEWPORT_BREAKPOINT). On those viewports the
// dropdown item also navigates in the same tab (no target="_blank").
const SMALL_VIEWPORT_BREAKPOINT = 480;
const ADD_PLACE_URL =
  "https://wheelmap.pro/organizations/LPb4y2ri7b6fLxLFa/survey-projects/wx4mM8xFiQAsB5aLi/show?step=data.osm_place";

test("Add a new place", async ({ page, context }) => {
  await page.goto("/");

  const viewportWidth = page.viewportSize()?.width ?? Number.POSITIVE_INFINITY;
  const isSmallViewport = viewportWidth < SMALL_VIEWPORT_BREAKPOINT;

  if (isSmallViewport) {
    // Open the hamburger menu so the link becomes accessible.
    await page.getByRole("button", { name: "Show menu" }).click();

    // On small viewports the item is a DropdownMenu.Item (role=menuitem) and navigates
    // in the current tab.
    await page.getByRole("menuitem", { name: "Add a new place" }).click();
    await expect(page).toHaveURL(ADD_PLACE_URL);
  } else {
    // On large viewports the link is rendered as an icon button with target="_blank".
    const [newTab] = await Promise.all([
      context.waitForEvent("page"),
      page.getByRole("link", { name: "Add a new place" }).click(),
    ]);
    await expect(newTab).toHaveURL(ADD_PLACE_URL);
  }
});
