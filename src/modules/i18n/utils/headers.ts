import {
  type LanguageTag,
  getILanguageTagsFromAcceptLanguageHeader,
  getMostPreferableLanguageTag,
} from "@sozialhelden/core";
import { headers } from "next/headers";

export function getLanguageTagFromAcceptLanguageHeaders(): LanguageTag {
  return getMostPreferableLanguageTag(
    getILanguageTagsFromAcceptLanguageHeader(
      String(headers().get("accept-language")),
    ),
  );
}
