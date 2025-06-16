import type { Locator, Page } from "@playwright/test";
import { expect, test } from "~/tests/e2e/setup/test-fixture";
import { skipOnMobiles } from "~/tests/e2e/utils/device";
import { mockTranslations } from "~/tests/e2e/utils/mocks";
import { skipOnboarding } from "~/tests/e2e/utils/onboarding";
import { getQueryParams, waitForQueryParam } from "~/tests/e2e/utils/url";
import emptyPhotonMock from "./empty-photon-mock.json";
import photonMock from "./photon-mock.json";

test.beforeEach(async ({ page }) => {
  await mockTranslations(page);
  await page.goto("/");
  await skipOnboarding(page);

  // when the search input is visible, wait another second before
  // interacting with it. there is some kind of race kondition, that
  // resets the input otherwise.
  getSearchInput(page);
  await page.waitForTimeout(1000);
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

    await expect(
      getSearchResultItem(page, "Park Inn by Radisson Berlin-Alexanderplatz"),
    ).toBeVisible();

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

    await waitForQueryParam(page, "category", "shopping");
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

    await waitForQueryParam(page, "category", "");
    expect(getQueryParams(page).get("category")).toBe("");
    await expect(getSearchInput(page)).toHaveValue("");
  });

  test("the search term can be set by url parameter", async ({ page }) => {
    test.slow();

    await searchFor(page, "foobar");
    await waitForQueryParam(page, "search", "foobar");
    expect(getQueryParams(page).get("search")).toBe("foobar");

    await page.goto("/?search=Alexanderplatz");
    await page.waitForResponse("**/api?q=Alexanderplatz*");

    await expect(
      getSearchResultItem(page, "Park Inn by Radisson Berlin-Alexanderplatz"),
    ).toBeVisible();
    await expect(getSearchResultItem(page, "Park Inn")).toBeVisible();
  });

  test("filtering by category resets the current search query", async ({
    page,
  }) => {
    skipOnMobiles();

    await searchFor(page, "Alexanderplatz");
    await expect(
      getSearchResultItem(page, "Park Inn by Radisson Berlin-Alexanderplatz"),
    ).toBeVisible();

    await page.getByRole("button", { name: "Shopping" }).click();

    await waitForQueryParam(page, "category", "shopping");
    await waitForQueryParam(page, "search", "");
    await expect(getSearchInput(page)).toHaveValue("Shopping");
    await expect(
      getSearchResultItem(page, "Park Inn by Radisson Berlin-Alexanderplatz"),
    ).toHaveCount(0);
    expect(getQueryParams(page).get("search")).toBe("");
  });

  test("typing into the search input resets the active category", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Shopping" }).click();
    await expect(getSearchInput(page)).toHaveValue("Shopping");

    await searchFor(page, "Alexanderplatz");

    await waitForQueryParam(page, "category", "");
    expect(getQueryParams(page).get("category")).toBe("");
  });
});
