import type { ServerResponse } from "http";
import type { ILanguageSubtag } from "@sozialhelden/ietf-language-tags";

export function setResponseLanguageHeaders(
  languageTags: ILanguageSubtag[],
  response?: ServerResponse,
): void {
  if (!response || languageTags.length === 0) {
    return;
  }
  response.setHeader("Vary", "X-Lang, Content-Language");
  response.setHeader("X-Lang", languageTags[0].langtag);
  response.setHeader(
    "Content-Language",
    languageTags.reduce((acc, tag) => `${acc}, ${tag.langTag}`, ""),
  );
}
