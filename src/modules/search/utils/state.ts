import type { NestedRecord } from "~/utils/search-params";

export function parseSearchQueryParameter(
  value: NestedRecord<string | undefined> | string | undefined,
): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  return value.trim();
}

export function parseLegacySearchQueryParameter(
  query: NestedRecord<string | undefined>,
): string | undefined {
  if (typeof query.q !== "string") {
    return undefined;
  }
  return query.q.trim();
}
