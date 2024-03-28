import { useContext } from "react";
import useSWR from "swr";
import EnvContext from "../../components/shared/EnvContext";
import { useCurrentAppToken } from "../context/AppContext";
import { ACCategory } from "../model/ac/categories/ACCategory";
import { generateSynonymCache } from "../model/ac/categories/Categories";

export async function fetchAccessibilityCloudCategories(appToken: string, baseUrl: string): Promise<ACCategory[]> {
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

export const useCategorySynonymCache = () => {
  const env = useContext(EnvContext);
  const baseUrl: string = env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL;
  const appToken: string = useCurrentAppToken();
  const fetcher = () => fetchAccessibilityCloudCategorySynonymCache(appToken, baseUrl);
  return useSWR([appToken, baseUrl], fetcher);
};
