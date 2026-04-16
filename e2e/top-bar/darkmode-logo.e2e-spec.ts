import { expect, test } from "../setup/test-fixture";
import { skipOnboarding } from "../utils/control-onboarding";
import { enableDarkMode, enableLightMode } from "../utils/dark-mode"; // Helper to toggle dark mode via class manipulation (hotkey needs focus)

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await skipOnboarding(page);
});

test.describe("Logo Display and Contrast", () => {
  test.skip("logo is visible in LIGHT mode", async ({ page }) => {
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

  test.skip("logo is visible in DARK mode", async ({ page }) => {
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

  test.skip("logo text should not have poor contrast in dark mode (BUG: Asana #1210099669460115)", async ({
    page,
  }) => {
    // BUG: The Wheelmap logo text is not visible on dark backgrounds
    // See: https://app.asana.com/1/1200321573365931/project/1213356985075012/task/1210099669460115
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

  test.skip("logo passes axe accessibility scan in light mode", async ({
    page,
  }) => {
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

  test.skip("logo passes axe accessibility scan in dark mode", async ({
    page,
  }) => {
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
