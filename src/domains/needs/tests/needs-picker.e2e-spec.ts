import { type Locator, type Page, expect, test } from "@playwright/test";
import {
  type NeedCategory,
  type NeedProperties,
  type NeedSettings,
  settings as needSettings,
} from "~/domains/needs/needs";
import { skipOnboarding } from "../../../../tests/e2e/utils/skipOnboarding";
import { getQueryParams } from "../../../../tests/e2e/utils/url";

const getDropdown = (page: Page): Locator => {
  return page
    .getByRole("dialog")
    .filter({ hasText: "Mobility" })
    .filter({ hasText: "Toilets" });
};
const getButton = (page: Page): Locator => {
  return page.getByRole("button", { name: "Select your needs" });
};
const forEachNeedCategory = async (
  callback: (settings: NeedSettings[NeedCategory]) => Promise<void>,
) => {
  await Promise.all(Object.values(needSettings).map(callback));
};
const forEachNeed = async (
  needs: NeedSettings[NeedCategory]["needs"],
  callback: (need: NeedProperties) => Promise<void>,
) => {
  await Promise.all(Object.values(needs).map(callback));
};

const openDropdown = async (page: Page) => {
  await expect(getButton(page)).toBeVisible();
  await getButton(page).click();
};
const assertDropdownIsVisible = async (page: Page) => {
  await expect(getDropdown(page)).toBeVisible();
};
const assertDropdownIsNotVisible = async (page: Page) => {
  await expect(getDropdown(page)).toHaveCount(0);
};

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await skipOnboarding(page);
});

test.describe("needs-picker", () => {
  test("it opens a dropdown when clicking the need-picker button", async ({
    page,
  }) => {
    await assertDropdownIsNotVisible(page);

    await openDropdown(page);

    await assertDropdownIsVisible(page);
  });

  test("the dropdown can be closed using the cancel button", async ({
    page,
  }) => {
    await openDropdown(page);

    await getDropdown(page).getByRole("button", { name: "Cancel" }).click();

    await assertDropdownIsNotVisible(page);
  });

  test("it shows all configured needs", async ({ page }) => {
    await openDropdown(page);

    await forEachNeedCategory(async ({ needs }) => {
      await forEachNeed(needs, async ({ label }) => {
        await expect(
          getDropdown(page).getByText(label()).first(),
        ).toBeVisible();
      });
    });
  });

  test("it shows all configured help-texts after clicking the help button", async ({
    page,
  }) => {
    await openDropdown(page);

    await forEachNeedCategory(async ({ title, needs }) => {
      const hasHelpText = Object.values(needs).find(
        ({ help }: NeedProperties) => Boolean(help),
      );
      if (!hasHelpText) {
        return;
      }
      await getDropdown(page)
        .getByLabel(`Show more information about ${title}`)
        .click();
      await forEachNeed(needs, async (need: NeedProperties) => {
        if (!need.help) {
          return;
        }
        await expect(
          getDropdown(page).getByText(need.help()).first(),
        ).toBeVisible();
      });
    });
  });

  test("it allows needs to be selected", async ({ page }) => {
    await openDropdown(page);
    await getDropdown(page)
      .getByRole("radio", { name: "Partially wheelchair accessible" })
      .click();

    await expect(
      getDropdown(page).getByRole("radio", {
        name: "Partially wheelchair accessible",
      }),
    ).toBeChecked();
  });

  test("it saves the need selection after clicking the save button", async ({
    page,
  }) => {
    await expect(
      page.getByRole("button", {
        name: "You have 2 needs selected: Partially wheelchair accessible, Fully wheelchair accessible toilet",
      }),
    ).toHaveCount(0);

    await openDropdown(page);
    await getDropdown(page)
      .getByRole("radio", { name: "Partially wheelchair accessible" })
      .click();
    await getDropdown(page)
      .getByRole("radio", { name: "Fully wheelchair accessible toilet" })
      .click();
    await getDropdown(page).getByRole("button", { name: "Save" }).click();
    await assertDropdownIsNotVisible(page);

    await expect(
      page.getByRole("button", {
        name: "You have 2 needs selected: Partially wheelchair accessible, Fully wheelchair accessible toilet",
      }),
    ).toBeVisible();
  });

  test("it adds the selected needs as URL query parameters", async ({
    page,
  }) => {
    expect(getQueryParams(page).get("wheelchair")).toBeFalsy();
    expect(getQueryParams(page).get("toilet")).toBeFalsy();

    await openDropdown(page);
    await getDropdown(page)
      .getByRole("radio", { name: "Partially wheelchair accessible" })
      .click();
    await getDropdown(page)
      .getByRole("radio", { name: "Fully wheelchair accessible toilet" })
      .click();
    await getDropdown(page).getByRole("button", { name: "Save" }).click();
    await assertDropdownIsNotVisible(page);

    expect(getQueryParams(page).getAll("wheelchair")).toEqual([
      "limited",
      "yes",
    ]);
    expect(getQueryParams(page).getAll("toilet")).toEqual(["yes"]);
  });

  test("it doesn't save needs when clicking the cancel button", async ({
    page,
  }) => {
    await openDropdown(page);
    await getDropdown(page)
      .getByRole("radio", { name: "Partially wheelchair accessible" })
      .click();
    await getDropdown(page)
      .getByRole("radio", { name: "Fully wheelchair accessible toilet" })
      .click();
    await getDropdown(page).getByRole("button", { name: "Cancel" }).click();
    await assertDropdownIsNotVisible(page);

    await expect(
      getButton(page).getByLabel("You have 2 needs selected"),
    ).toHaveCount(0);
    await expect(
      getButton(page).getByLabel("Partially wheelchair accessible"),
    ).toHaveCount(0);
    await expect(
      getButton(page).getByLabel("Fully wheelchair accessible toilet"),
    ).toHaveCount(0);
    expect(getQueryParams(page).get("wheelchair")).toBeFalsy();
    expect(getQueryParams(page).get("toilet")).toBeFalsy();
  });
});
