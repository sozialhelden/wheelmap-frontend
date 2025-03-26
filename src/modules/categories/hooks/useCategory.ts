import * as React from "react";
import { useMemo } from "react";
import useSWR from "swr";

import {
  getCategory,
  getCategoryForFeature,
  unknownCategory,
} from "~/modules/categories/utils/cache";
import { useCurrentAppToken } from "~/lib/context/AppContext";
import { useEnvironmentContext } from "~/modules/app/context/EnvironmentContext";
import { fetchAccessibilityCloudCategorySynonymCache } from "~/modules/categories/utils/fetch";
import type { AnyFeature } from "../../../lib/model/geo/AnyFeature";

export const useCategorySynonymCache = () => {
  const appToken = useCurrentAppToken();
  const env = useEnvironmentContext();
  const baseUrl = env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL;
  return useSWR(
    (appToken && baseUrl && [appToken, baseUrl]) || null,
    fetchAccessibilityCloudCategorySynonymCache,
  );
};

export default function useCategory(
  ...features: (AnyFeature | null | undefined)[]
) {
  const categorySynonymCache = useCategorySynonymCache();
  const category = React.useMemo(() => {
    if (!categorySynonymCache.data) {
      return unknownCategory;
    }

    for (const feature of features) {
      if (!feature) {
        continue;
      }

      const result = getCategoryForFeature(categorySynonymCache.data, feature);
      if (result && result !== unknownCategory) {
        return result;
      }
    }

    return unknownCategory;
  }, [categorySynonymCache.data, features]);

  return { categorySynonymCache, category };
}

export function useCategoryString(input?: string) {
  const categorySynonymCache = useCategorySynonymCache();

  const category = useMemo(() => {
    if (!input || !categorySynonymCache.data) {
      return unknownCategory;
    }
    return getCategory(categorySynonymCache.data, input);
  }, [input, categorySynonymCache.data]);

  return { categorySynonymCache, category };
}
