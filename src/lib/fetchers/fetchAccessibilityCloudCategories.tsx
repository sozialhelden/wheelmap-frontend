import useSWR from "swr";
import { ACCategory } from "../model/ac/categories/ACCategory";
import { generateSynonymCache } from "../model/ac/categories/Categories";
import { accessibilityCloudCachedBaseUrl } from "./config";

export async function fetchAccessibilityCloudCategories(appToken?: string, baseUrl?: string): Promise<ACCategory[]> {
  baseUrl = baseUrl ? baseUrl : accessibilityCloudCachedBaseUrl;
  console.log(baseUrl);
  const url = `${baseUrl}/categories.json?appToken=${appToken}`;
  const r = await fetch(url, {
    method: "GET",
  });
  const json = await r.json();
  return (json as any).results;
}

export async function fetchAccessibilityCloudCategorySynonymCache(appToken?: string, baseUrl?: string) {
  const categories = await fetchAccessibilityCloudCategories(appToken, baseUrl);
  const synonyms = generateSynonymCache(categories);
  return synonyms;
}

export const useCategorySynonymCache = (appToken?: string, baseUrl?: string) => {
  const fetcher = () => fetchAccessibilityCloudCategorySynonymCache(appToken, baseUrl);
  return useSWR([appToken, baseUrl], fetcher);
};
