import type { Page } from "@playwright/test";

export const getQueryParams = (page: Page): URLSearchParams => {
  return new URL(page.url()).searchParams;
};

export const waitForQueryParam = async (
  page: Page,
  param: string,
  value = "",
) => {
  return page.waitForURL(
    new RegExp(String.raw`[?&]${param}=${value}(?:&|$)`, "g"),
  );
};
