import type { Page } from "@playwright/test";

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

export { enableDarkMode, enableLightMode };
