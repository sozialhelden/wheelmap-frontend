import useSWR from "swr";
import { ACCategory } from "../model/ac/categories/ACCategory";
import { generateSynonymCache } from "../model/ac/categories/Categories";
import { accessibilityCloudCachedBaseUrl } from "./config";

export async function fetchAccessibilityCloudCategories(
  appToken?: string
): Promise<ACCategory[]> {
  const url = `${accessibilityCloudCachedBaseUrl}/categories.json?appToken=${appToken}`;
  const r = await fetch(url, {
    method: "GET",
  });
  const json = await r.json();
  return (json as any).results;
}

export async function fetchAccessibilityCloudCategorySynonymCache(
  appToken?: string
) {
  const categories = await fetchAccessibilityCloudCategories(appToken);
  const synonyms = generateSynonymCache(categories);
  return synonyms;
}

export const useCategorySynonymCache = (appToken?: string) =>
  useSWR([appToken], fetchAccessibilityCloudCategorySynonymCache);
