import type { Locator, Page } from "@playwright/test";
import { expect, test } from "../../../../tests/e2e/setup/test-fixture";
import { skipOnboarding } from "../../../../tests/e2e/utils/skipOnboarding";
import { getQueryParams } from "../../../../tests/e2e/utils/url";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await skipOnboarding(page);
});

const getSearchInput = (page: Page): Locator => {
  return page.getByRole("searchbox");
};
const getSearchDropdown = (page: Page): Locator => {
  return page.getByTestId("search-result-dropdown");
};
const getSearchResultItem = (page: Page, hasText: string): Locator => {
  return getSearchDropdown(page)
    .getByRole("listitem")
    .filter({ hasText })
    .first();
};
const searchFor = async (page: Page, query: string): Promise<void> => {
  await getSearchInput(page).fill(`${query}`);
  await page.waitForResponse(`**/place-infos.json?q=${query}*`);
  await page.waitForResponse(`**/api?q=${query}*`);
};

test.describe("search-input", () => {
  test("it shows a search input", async ({ page }) => {
    await expect(getSearchInput(page)).toBeVisible();
  });

  test("it shows a list of search results when typing", async ({ page }) => {
    test.slow();
    await expect(
      getSearchResultItem(page, "Alexanderplatz Transit station"),
    ).toHaveCount(0);
    await expect(getSearchResultItem(page, "Park Inn")).toHaveCount(0);

    await searchFor(page, "Alexanderplatz");

    await expect(
      getSearchResultItem(page, "Alexanderplatz Transit station"),
    ).toBeVisible();
    await expect(getSearchResultItem(page, "Park Inn")).toBeVisible();
  });

  test("clicking on a search result navigates to the places detail page", async ({
    page,
  }) => {
    test.slow();
    await searchFor(page, "Alexanderplatz");
    await getSearchResultItem(page, "Alexanderplatz Transit station").click();

    await page.waitForURL("**/amenities/node:3908141014**");
  });

  test("it shows an empty state if not results are found", async ({ page }) => {
    test.slow();
    await expect(
      getSearchDropdown(page).getByText("No results found!"),
    ).toHaveCount(0);

    // if a place named like this exists it is well deserved to break our tests 🖖
    await searchFor(
      page,
      "paiX9uz4aivaik2ie8uh2zeTaaghoovei1ahT2agef0quei2IechixeeH2Beiyuu",
    );

    await expect(
      getSearchDropdown(page).getByText("No results found!"),
    ).toBeVisible();
    await expect(getSearchDropdown(page).getByRole("listitem")).toHaveCount(0);
  });

  test("the input is cleared when clicking the clear button", async ({
    page,
  }) => {
    test.slow();
    await searchFor(page, "Alexanderplatz");
    await expect(
      getSearchResultItem(page, "Alexanderplatz Transit station"),
    ).toBeVisible();

    await page.getByRole("button", { name: "Clear search" }).click();

    await expect(getSearchInput(page)).toHaveValue("");
    await expect(
      getSearchResultItem(page, "Alexanderplatz Transit station"),
    ).toHaveCount(0);
  });

  test("it can navigate the search results with the keyboard", async ({
    page,
  }) => {
    test.slow();
    await searchFor(page, "Alexanderplatz");

    let foundItem = false;
    let counter = 0;
    while (!foundItem) {
      await getSearchInput(page).press("ArrowDown");
      foundItem = await getSearchDropdown(page)
        .getByTestId("highlighted-search-result")
        .filter({ hasText: "Alexanderplatz Transit station" })
        .isVisible();
      counter++;
      if (counter > 30) {
        throw new Error("Loop limit exceeded!");
      }
    }
    await getSearchInput(page).press("Enter");

    await page.waitForURL("**/amenities/node:3908141014**");
  });

  test("filtering by a category displays the category in the search input", async ({
    page,
  }) => {
    await expect(getSearchInput(page)).toHaveValue("");

    await page.getByRole("button", { name: "Shopping" }).click();

    expect(getQueryParams(page).get("category")).toBe("shopping");
    await expect(getSearchInput(page)).toHaveValue("Shopping");
  });

  test("resetting the search input also resets the active category", async ({
    page,
  }) => {
    await expect(getSearchInput(page)).toHaveValue("");
    await page.getByRole("button", { name: "Shopping" }).click();
    await expect(getSearchInput(page)).toHaveValue("Shopping");
    expect(getQueryParams(page).get("category")).toBe("shopping");

    await page.getByRole("button", { name: "Clear search" }).click();

    expect(getQueryParams(page).get("category")).toBe("");
    await expect(getSearchInput(page)).toHaveValue("");
  });

  test("filtering by category resets the current search query", async ({
    page,
  }) => {
    test.slow();
    await searchFor(page, "Alexanderplatz");
    await expect(
      getSearchResultItem(page, "Alexanderplatz Transit station"),
    ).toBeVisible();

    await page.getByRole("button", { name: "Shopping" }).click();

    await expect(getSearchInput(page)).toHaveValue("Shopping");
    await expect(
      getSearchResultItem(page, "Alexanderplatz Transit station"),
    ).toHaveCount(0);
    expect(getQueryParams(page).get("q")).toBe("");
  });

  test("typing into the search input resets the active category", async ({
    page,
  }) => {
    test.slow();
    await page.getByRole("button", { name: "Shopping" }).click();
    await expect(getSearchInput(page)).toHaveValue("Shopping");

    await searchFor(page, "Alexanderplatz");

    expect(getQueryParams(page).get("category")).toBe("");
  });
});
