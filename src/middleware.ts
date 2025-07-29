import {
  getILanguageTagsFromAcceptLanguageHeader,
  getMostPreferableLanguageTag,
} from "@sozialhelden/core";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export function middleware() {
  // Determine the most preferable language tag from the accept-Language header,
  // set the appropriate response language headers as well as the internally used
  // x-preferred-language-tag header. The latter is used to select the correct
  // language in e.g. Transifex. There's probably a better way to pass data from a
  // middleware to other parts of the application (sessions?), feel free to improve.

  // TODO: When switching to the app router, this part can be abstracted to a utility
  //  in the i18n directory.
  const languageTags = getILanguageTagsFromAcceptLanguageHeader(
    String(headers().get("accept-language")),
  );
  const languageTag = getMostPreferableLanguageTag(languageTags);

  const newRequestHeaders = new Headers(headers());
  newRequestHeaders.set("x-preferred-language-tag", languageTag);

  const response = NextResponse.next({
    request: {
      headers: newRequestHeaders,
    },
  });

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
