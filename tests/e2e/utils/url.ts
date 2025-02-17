import type { Page } from "@playwright/test";

export const getQueryParams = (page: Page): URLSearchParams => {
  return new URL(page.url()).searchParams;
};
