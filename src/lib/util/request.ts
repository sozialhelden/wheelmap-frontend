import type { IncomingMessage } from "http";
import { parseLanguageTag } from "@sozialhelden/ietf-language-tags";
import type { ILanguageSubtag } from "@sozialhelden/ietf-language-tags";
import { type ParsedQuery, parseUrl } from "query-string";
import { parseAcceptLanguageString } from "~/lib/i18n/parseAcceptLanguageString";

export function getRequestUrl(request?: IncomingMessage): string {
  return request?.url ?? window.location.href;
}

export function getRequestUserAgentString(request?: IncomingMessage): string {
  return request?.headers["user-agent"] ?? navigator.userAgent;
}

export function getRequestHostname(request?: IncomingMessage): string {
  const withPort = request?.headers.host ?? window.location.hostname;
  return withPort.split(":")[0];
}

export function getRequestQuery(
  request?: IncomingMessage,
): ParsedQuery<string> {
  return parseUrl(getRequestUrl(request)).query;
}

export function getRequestLanguageTags(request?: IncomingMessage): string[] {
  if (request) {
    return parseAcceptLanguageString(
      request.headers?.["accept-language"] ?? "en-US",
    );
  }
  return Array.from(new Set([navigator.language, ...navigator.languages]));
}

export function getRequestILanguageTags(
  request?: IncomingMessage,
): ILanguageSubtag[] {
  return getRequestLanguageTags(request)
    .map((tag) => parseLanguageTag(tag))
    .filter(Boolean);
}

export function getRequestCountryCode(
  request?: IncomingMessage,
): string | undefined {
  const countryCode =
    (request?.headers?.["cf-ipcountry"] as string) ||
    (request?.headers?.["x-country-code"] as string);
  if (countryCode) {
    return countryCode;
  }
  return (
    getRequestILanguageTags(request).find((tag) => !!tag.region)?.region ?? ""
  );
}
