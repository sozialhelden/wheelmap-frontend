import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

/**
 * Read environment variables from the e2e env file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config({ path: "e2e/lib/.env" });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./",
  testMatch: "**/*.e2e-spec.ts",
  /* Run tests in files in parallel */
  fullyParallel: !process.env.CI,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 4 : 0,
  workers: process.env.CI ? 4 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["html", { open: "never" }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /*
      Base URL to use in actions like `await page.goto('/')`.
    */
    // TODO: Beware, this does not work in CI yet for yet unknown reasons.
    baseURL: process.env.CI_TEST_DEPLOYMENT_BASE_URL || "http://localhost:3000",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "retain-on-failure",

    /* Record videos for failing tests. See https://playwright.dev/docs/videos */
    video: "retain-on-failure",

    /* TLS errors can happen when an Ingress is freshly deployed in CI. */
    ignoreHTTPSErrors: true,

    /* Disable CSS animations / transitions for deterministic tests. */
    reducedMotion: "reduce",
  },

  /* Start the Next.js dev server locally when no external deployment URL is provided.
     In CI, CI_TEST_DEPLOYMENT_BASE_URL points to an already-running deployment. */
  webServer: process.env.CI_TEST_DEPLOYMENT_BASE_URL
    ? undefined
    : {
        command: "pnpm dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120 * 1000,
        env: process.env as Record<string, string>,
      },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: "mobile-chromium",
    //   use: { ...devices["Pixel 5"] },
    // },
    // {
    //   name: "mobile-safari",
    //   use: { ...devices["iPhone 12"] },
    // },
    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
});
