import { NextResponse } from "next/server";

import { getLanguageTagFromAcceptLanguageHeaders } from "~/modules/i18n/utils/headers";

export function middleware() {
  const languageTag = getLanguageTagFromAcceptLanguageHeaders();

  const response = NextResponse.next();
  response.headers.set("Vary", "X-Lang, Content-Language");
  response.headers.set("X-Lang", languageTag);
  response.headers.set("Content-Language", languageTag);

  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next and __next)
    "/((?!_next|__next).*)",
  ],
};
