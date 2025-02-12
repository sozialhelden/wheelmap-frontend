import useSWR from 'swr'
import { useCurrentAppToken } from '../../../context/AppContext'
import { useEnvContext } from '../../../context/EnvContext'
import type { ACCategory } from '../../../../domains/categories/types/ACCategory'

import {generateSynonymCache} from "~/domains/categories/functions/cache";

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

export const useCategorySynonymCache = () => {
  const appToken = useCurrentAppToken();
  const env = useEnvContext();
  const baseUrl = env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL;
  return useSWR(
    (appToken && baseUrl && [appToken, baseUrl]) || null,
    fetchAccessibilityCloudCategorySynonymCache,
  );
};
