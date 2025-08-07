import AxeBuilder from "@axe-core/playwright";
import { test as base } from "@playwright/test";

type TestFixture = {
  makeAxeBuilder: () => AxeBuilder;
};

export const test = base.extend<TestFixture>({
  // https://playwright.dev/docs/accessibility-testing#using-a-test-fixture-for-common-axe-configuration
  makeAxeBuilder: async ({ page }, use, testInfo) => {
    const makeAxeBuilder = () =>
      new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .exclude("#commonly-reused-element-with-known-issue");

    await use(makeAxeBuilder);
  },
});

export { expect } from "@playwright/test";
