import type { BrowserContext } from "playwright-core";
import { expect, test } from "~/tests/e2e/setup/test-fixture";
import { mockTranslations } from "~/tests/e2e/utils/mocks";
import { skipOnboarding } from "~/tests/e2e/utils/skip";

async function setAcceptLanguageHeader(
  context: BrowserContext,
  header: string,
) {
  await context.route("**/*", (route, request) => {
    route.continue({
      headers: {
        ...request.headers(),
        "accept-language": header,
      },
    });
  });
}

test("uses the accept-language header to set the resulting locale", async ({
  page,
  context,
}) => {
  await setAcceptLanguageHeader(context, "de-DE,de;q=0.9,en;q=0.8");

  await page.goto("/");
  await skipOnboarding(page);

  await expect(
    page
      .getByRole("banner")
      .getByRole("button", { name: "Wähle deine Bedürfnisse aus" }),
  ).toHaveCount(1);
  await expect(
    page.getByRole("banner").getByRole("button", { name: "Select your needs" }),
  ).toHaveCount(0);
});

test("it sets the correct language response headers", async ({
  page,
  context,
}) => {
  await setAcceptLanguageHeader(context, "de-DE,de;q=0.9,en;q=0.8");

  const url =
    "?category=&q=&wheelchair=&toilet=&zoom=17.85147942&lat=52.52493343&lon=13.37019983";

  page.on("response", async (response) => {
    if (response.url().includes(url)) {
      const headers = response.headers();
      expect(headers["x-lang"]).toBe("de");
      expect(headers["content-language"]).toBe("de");
    }
  });

  await mockTranslations(page);
  await page.goto(`/${url}`);
});
