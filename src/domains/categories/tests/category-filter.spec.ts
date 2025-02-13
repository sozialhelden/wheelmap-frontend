import { test } from "@playwright/test";
import { getCategoryList } from "~/domains/categories/functions/display";
import { expect } from "../../../../tests/setup/test-fixture";
import { skipOnboarding } from "../../../../tests/utils/skipOnboarding";
import { getQueryParams } from "../../../../tests/utils/url";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await skipOnboarding(page);
});

test.describe("category-filter", () => {
  test("it shows only the first 5 configured categories", async ({ page }) => {
    await Promise.all(
      getCategoryList()
        .slice(0, 5)
        .map(async ({ name }) => {
          await expect(
            page.getByRole("button", { name: name() }),
          ).toBeVisible();
        }),
    );
    await Promise.all(
      getCategoryList()
        .slice(5)
        .map(async ({ name }) => {
          await expect(page.getByRole("button", { name: name() })).toHaveCount(
            0,
          );
        }),
    );
  });

  test("it opens a dropdown with the remaining categories when clicking the more button", async ({
    page,
  }) => {
    const dropdownCategories = getCategoryList().slice(5);
    await Promise.all(
      dropdownCategories.map(async ({ name }) => {
        await expect(page.getByRole("menuitem", { name: name() })).toHaveCount(
          0,
        );
      }),
    );

    await page.getByRole("button", { name: "More ..." }).click();

    await Promise.all(
      dropdownCategories.map(async ({ name }) => {
        await expect(
          page.getByRole("menuitem", { name: name() }),
        ).toBeVisible();
      }),
    );
  });

  test("it adds the category as URL query param when clicking a category", async ({
    page,
  }) => {
    expect(getQueryParams(page).get("category")).toBeFalsy();

    await page.getByRole("button", { name: "Shopping" }).click();

    expect(getQueryParams(page).get("category")).toBe("shopping");
  });

  test("it adds the category as URL query param when clicking a category in the menu", async ({
    page,
  }) => {
    expect(getQueryParams(page).get("category")).toBeFalsy();
    await expect(page.getByRole("menuitem", { name: "Money" })).toHaveCount(0);

    await page.getByRole("button", { name: "More ..." }).click();
    await expect(page.getByRole("menuitem", { name: "Money" })).toBeVisible();
    await page.getByRole("menuitem", { name: "Money" }).click();

    expect(getQueryParams(page).get("category")).toBe("money_post");
  });
});
