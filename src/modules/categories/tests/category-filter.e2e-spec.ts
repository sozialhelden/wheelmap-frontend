import { test } from "@playwright/test";
import { getTopLevelCategoryList } from "~/modules/categories/utils/display";
import { expect } from "~/tests/e2e/setup/test-fixture";
import { skipOnboarding } from "~/tests/e2e/utils/onboarding";
import { getQueryParams, waitForQueryParam } from "~/tests/e2e/utils/url";
import { mockTranslations } from "~/tests/e2e/utils/mocks";

test.beforeEach(async ({ page }) => {
  await mockTranslations(page);
  await page.goto("/");

  // still some race conditions...
  await page.waitForTimeout(1000);
});

test.describe("category-filter", () => {
  test("it shows only the first 5 configured categories", async ({ page }) => {
    await Promise.all(
      getTopLevelCategoryList()
        .slice(0, 5)
        .map(async ({ name }) => {
          await expect(
            page.getByRole("button", { name: name() }),
          ).toBeVisible();
        }),
    );
    await Promise.all(
      getTopLevelCategoryList()
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
    const dropdownCategories = getTopLevelCategoryList().slice(5);
    await Promise.all(
      dropdownCategories.map(async ({ name }) => {
        await expect(page.getByRole("menuitem", { name: name() })).toHaveCount(
          0,
        );
      }),
    );

    await page.getByRole("button", { name: "More…" }).click();

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

    await waitForQueryParam(page, "category", "shopping");
    expect(getQueryParams(page).get("category")).toBe("shopping");
  });

  test("it adds the category as URL query param when clicking a category in the menu", async ({
    page,
  }) => {
    expect(getQueryParams(page).get("category")).toBeFalsy();
    await expect(page.getByRole("menuitem", { name: "Money" })).toHaveCount(0);

    await page.getByRole("button", { name: "More…" }).click();
    await expect(page.getByRole("menuitem", { name: "Money" })).toBeVisible();
    await page.getByRole("menuitem", { name: "Money" }).click();

    await waitForQueryParam(page, "category", "money_post");
    expect(getQueryParams(page).get("category")).toBe("money_post");
  });
});
