import type { ACCategory } from "../types/ACCategory";

import { generateSynonymCache } from "~/modules/categories/functions/cache";

export async function fetchAccessibilityCloudCategories([appToken, baseUrl]: [
  string,
  string,
]): Promise<ACCategory[]> {
  const url = `${baseUrl}/categories.json?appToken=${appToken}`;
  const r = await fetch(url, {
    method: "GET",
  });
  const json = await r.json();
  return (json as { results: ACCategory[] }).results;
}

export async function fetchAccessibilityCloudCategorySynonymCache([
  appToken,
  baseUrl,
]: [string, string]) {
  const categories = await fetchAccessibilityCloudCategories([
    appToken,
    baseUrl,
  ]);
  const synonyms = generateSynonymCache(categories);
  return synonyms;
}
