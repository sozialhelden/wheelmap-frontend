import { expect, test } from "@playwright/test";
import { skipOnboarding } from "./skipOnboarding";

/**
 * Helper function to click a banner link and return the new tab
 * @param page - The current page object
 * @param linkName - The name of the link to click
 * @returns The new tab that opens
 */
async function clickBannerLinkAndGetNewTab(page, linkName: string) {
  await page.waitForURL("https://feature-a11ymap.wheelmap.tech/");
  // Wait for the new tab to open
  const newTabPromise = page.waitForEvent("popup");
  await page.getByRole("banner").getByRole("link", { name: linkName }).click();
  const newTab = await newTabPromise;
  await newTab.waitForLoadState();
  return newTab;
}

test.beforeEach(async ({ page }) => {
  // Go to the starting url before each test.
  await page.goto("/");
  await skipOnboarding(page);
});

test.skip("Get involved", async ({ page }) => {
  const newTab = await clickBannerLinkAndGetNewTab(page, "Get involved");
  // Check if the URL and title of the new tab are correct
  await expect(newTab).toHaveURL(
    "https://news.wheelmap.org/en/wheelmap-ambassador-program-2021/",
  );
  await expect(newTab).toHaveTitle(
    "Wheelmap Ambassador Program 2021 – Wheelmap.org",
  );
});

test.skip("News", async ({ page }) => {
  const newTab = await clickBannerLinkAndGetNewTab(page, "News");
  // Check if the URL of the new tab is correct
  await expect(newTab).toHaveURL("https://news.wheelmap.org/en/#news");
});

test.skip("Press", async ({ page }) => {
  const newTab = await clickBannerLinkAndGetNewTab(page, "Press");
  // Check if the URL of the new tab is correct
  await expect(newTab).toHaveURL("https://news.wheelmap.org/en/press/");
});

test.skip("Events", async ({ page }) => {
  await page.waitForURL("https://feature-a11ymap.wheelmap.tech/");
  await page.getByRole("banner").getByRole("link", { name: "Events" }).click();
  // Check if the URL is correct
  await expect(page).toHaveURL("https://feature-a11ymap.wheelmap.tech/events");
});

test.skip("Add a new place", async ({ page }) => {
  const newTab = await clickBannerLinkAndGetNewTab(page, "Add a new place");
  // Check if the URL of the new tab is correct
  await expect(newTab).toHaveURL(
    "https://wheelmap.pro/organizations/LPb4y2ri7b6fLxLFa/survey-projects/wx4mM8xFiQAsB5aLi/show?step=data.osm_place",
  );
});
