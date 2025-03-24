import type { Locator, Page } from "@playwright/test";
import { expect, test } from "../../../../tests/e2e/setup/test-fixture";
import { skipOnboarding } from "../../../../tests/e2e/utils/skipOnboarding";
import { getQueryParams } from "../../../../tests/e2e/utils/url";
import emptyPhotonMock from "./empty-photon-mock.json";
import photonMock from "./photon-mock.json";

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
const searchFor = async (
  page: Page,
  query: string,
  empty = false,
): Promise<void> => {
  await page.route(`**/api?q=${query}*`, async (route) => {
    await route.fulfill({ json: empty ? emptyPhotonMock : photonMock });
  });
  await getSearchInput(page).fill(`${query}`);
  await expect(getSearchDropdown(page).getByTestId("is-searching")).toHaveCount(
    0,
  );

  // without a manual wait, some of the tests are quite flaky. there are probably some
  // race conditions somewhere... 5 seconds seems to be the most reliable value. this
  // is not ideal, if you find a better solution please change this!
  await new Promise((resolve) => setTimeout(resolve, 5000));
};

test.describe("search-input", () => {
  test("it shows a search input", async ({ page }) => {
    await expect(getSearchInput(page)).toBeVisible();
  });

  test("it queries the photon api", async ({ page }) => {
    test.slow();
    const query = "Alexanderplatz";
    await getSearchInput(page).fill(`${query}`);

    await page.waitForResponse(`**/api?q=${query}*`);

    await expect(
      getSearchResultItem(page, "Park Inn by Radisson Berlin-Alexanderplatz"),
    ).toBeVisible();
    await expect(getSearchResultItem(page, "Park Inn")).toBeVisible();
  });

  test("it shows a list of search results when typing", async ({ page }) => {
    await expect(
      getSearchResultItem(page, "Park Inn by Radisson Berlin-Alexanderplatz"),
    ).toHaveCount(0);
    await expect(getSearchResultItem(page, "Park Inn")).toHaveCount(0);

    await searchFor(page, "Alexanderplatz");

    await expect(
      getSearchResultItem(page, "Park Inn by Radisson Berlin-Alexanderplatz"),
    ).toBeVisible();
    await expect(getSearchResultItem(page, "Park Inn")).toBeVisible();
  });

  test("clicking on a search result navigates to the places detail page", async ({
    page,
  }) => {
    await searchFor(page, "Alexanderplatz");

    await getSearchResultItem(
      page,
      "Park Inn by Radisson Berlin-Alexanderplatz",
    ).click();

    await page.waitForURL("**/amenities/way:23723125**");
  });

  test("it shows an empty state if not results are found", async ({ page }) => {
    await expect(
      getSearchDropdown(page).getByText("No results found!"),
    ).toHaveCount(0);

    await searchFor(page, "Something", true);

    await expect(
      getSearchDropdown(page).getByText("No results found!"),
    ).toBeVisible();
    await expect(getSearchDropdown(page).getByRole("listitem")).toHaveCount(0);
  });

  test("the input is cleared when clicking the clear button", async ({
    page,
  }) => {
    await searchFor(page, "Alexanderplatz");
    await expect(
      getSearchResultItem(page, "Park Inn by Radisson Berlin-Alexanderplatz"),
    ).toBeVisible();

    await page.getByRole("button", { name: "Clear search" }).click();

    await expect(getSearchInput(page)).toHaveValue("");
    await expect(
      getSearchResultItem(page, "Park Inn by Radisson Berlin-Alexanderplatz"),
    ).toHaveCount(0);
  });

  test("it can navigate the search results with the keyboard", async ({
    page,
  }) => {
    await searchFor(page, "Alexanderplatz");

    let foundItem = false;
    let counter = 0;
    while (!foundItem) {
      await getSearchInput(page).press("ArrowDown");
      foundItem = await getSearchDropdown(page)
        .getByTestId("highlighted-search-result")
        .filter({ hasText: "Park Inn by Radisson Berlin-Alexanderplatz" })
        .isVisible();
      counter++;
      if (counter > 30) {
        throw new Error("Loop limit exceeded!");
      }
    }
    await getSearchInput(page).press("Enter");

    await page.waitForURL("**/amenities/way:23723125**");
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
    await searchFor(page, "Alexanderplatz");
    await expect(
      getSearchResultItem(page, "Park Inn by Radisson Berlin-Alexanderplatz"),
    ).toBeVisible();

    await page.getByRole("button", { name: "Shopping" }).click();

    await expect(getSearchInput(page)).toHaveValue("Shopping");
    await expect(
      getSearchResultItem(page, "Park Inn by Radisson Berlin-Alexanderplatz"),
    ).toHaveCount(0);
    expect(getQueryParams(page).get("q")).toBe("");
  });

  test("typing into the search input resets the active category", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Shopping" }).click();
    await expect(getSearchInput(page)).toHaveValue("Shopping");

    await searchFor(page, "Alexanderplatz");

    expect(getQueryParams(page).get("category")).toBe("");
  });
});
