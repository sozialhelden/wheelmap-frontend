import type { ServerResponse } from "node:http";
import type { LanguageTag } from "~/modules/i18n/i18n";

export function setResponseLanguageHeaders(
  locale: LanguageTag,
  response?: ServerResponse,
): void {
  if (!response || !locale) {
    return;
  }
  response.setHeader("Vary", "X-Lang, Content-Language");
  response.setHeader("X-Lang", locale);
  response.setHeader("Content-Language", locale);
}
