import { expect, test } from "~/tests/e2e/setup/test-fixture";
import type { Page } from "@playwright/test"; // Helper to dismiss onboarding dialog

// Helper to dismiss onboarding dialog
async function dismissOnboarding(page: Page) {
  await page.waitForLoadState("networkidle");

  // const dialog = page.getByRole("dialog");
  //
  // try {
  //   await dialog.waitFor({ state: "visible", timeout: 5000 });
  //
  //   // Click through all visible onboarding buttons
  //   const buttonPatterns = [/okay|let.*go/i, /skip/i, /let.*go/i];
  //
  //   for (const pattern of buttonPatterns) {
  //     const button = page.getByRole("button", { name: pattern });
  //     if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
  //       await button.click();
  //       await page.waitForTimeout(500);
  //     }
  //   }
  // } catch {
  //   // Dialog may not appear
  // }
}

// Helper to toggle dark mode via class manipulation (hotkey needs focus)
async function enableDarkMode(page: Page) {
  await page.evaluate(() => {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  });
  await page.waitForTimeout(300);
}

async function enableLightMode(page: Page) {
  await page.evaluate(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    localStorage.setItem("theme", "light");
  });
  await page.waitForTimeout(300);
}

test.describe("Logo Display and Contrast", () => {
  test("logo is visible in LIGHT mode", async ({ page }) => {
    await page.goto("/");
    await dismissOnboarding(page);
    await enableLightMode(page);

    // Verify light mode
    await expect(page.locator("html")).toHaveClass(/light/);

    // Logo link should be visible
    const logoLink = page
      .getByRole("banner")
      .getByRole("link", { name: "Home" });
    await expect(logoLink).toBeVisible();

    // Logo SVG should be visible
    const logoSvg = logoLink.locator("svg").first();
    await expect(logoSvg).toBeVisible();
  });

  test("logo is visible in DARK mode", async ({ page }) => {
    await page.goto("/");
    await dismissOnboarding(page);
    await enableDarkMode(page);

    // Verify dark mode
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Logo link should be visible
    const logoLink = page
      .getByRole("banner")
      .getByRole("link", { name: "Home" });
    await expect(logoLink).toBeVisible();

    // Logo SVG should be visible
    const logoSvg = logoLink.locator("svg").first();
    await expect(logoSvg).toBeVisible();
  });

  test("logo text has POOR contrast in dark mode (BUG: Asana #1210099669460115)", async ({
    page,
  }) => {
    // BUG: The Wheelmap logo text is not visible on dark backgrounds
    // See: https://app.asana.com/1/1200321573365931/project/1213356985075012/task/1210099669460115
    await page.goto("/");
    await dismissOnboarding(page);
    await enableDarkMode(page);

    // Verify dark mode is active
    await expect(page.locator("html")).toHaveClass(/dark/);

    const logoLink = page
      .getByRole("banner")
      .getByRole("link", { name: "Home" });
    const logoSvg = logoLink.locator("svg").first();
    await expect(logoSvg).toBeVisible();

    // Check if SVG text elements have light colors in dark mode
    // The bug is that text paths remain dark (low contrast) on dark backgrounds
    const svgPaths = logoSvg.locator("path");
    const pathCount = await svgPaths.count();

    // Get fill colors of all paths
    const darkFills: string[] = [];
    for (let i = 0; i < pathCount; i++) {
      const fill = await svgPaths.nth(i).evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.fill || el.getAttribute("fill") || "";
      });
      // Check for dark colors (black, near-black)
      if (fill.match(/#[0-3][0-3][0-3]|#111|rgb\s*\(\s*[0-3]?\d\s*,/i)) {
        darkFills.push(fill);
      }
    }

    // BUG: This test will FAIL until the bug is fixed
    // When fixed, no paths should have dark fills in dark mode
    expect(
      darkFills.length,
      `BUG: Logo has ${darkFills.length} path(s) with dark fill in dark mode: ${darkFills.join(", ")}\nExpected: All text paths should have light fill colors for visibility on dark backgrounds.`,
    ).toBe(0);
  });

  test("logo passes axe accessibility scan in light mode", async ({ page }) => {
    await page.goto("/");
    await dismissOnboarding(page);
    await enableLightMode(page);

    const AxeBuilder = (await import("@axe-core/playwright")).default;

    const results = await new AxeBuilder({ page })
      .include('[role="banner"]')
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(
      results.violations,
      "Light mode: Banner should have no accessibility violations",
    ).toEqual([]);
  });

  test("logo passes axe accessibility scan in dark mode", async ({ page }) => {
    await page.goto("/");
    await dismissOnboarding(page);
    await enableDarkMode(page);

    const AxeBuilder = (await import("@axe-core/playwright")).default;

    const results = await new AxeBuilder({ page })
      .include('[role="banner"]')
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    // Note: Axe may not detect SVG fill color contrast issues
    expect(
      results.violations,
      "Dark mode: Banner should have no accessibility violations",
    ).toEqual([]);
  });
});
