import * as React from "react";
import useSWR from "swr";
import {
  getCategoryForFeature,
  unknownCategory,
} from "~/domains/categories/functions/cache";
import { fetchAccessibilityCloudCategorySynonymCache } from "~/domains/categories/functions/fetch";
import { useCurrentAppToken } from "~/lib/context/AppContext";
import { useEnvContext } from "~/lib/context/EnvContext";
import type { AnyFeature } from "../../../lib/model/geo/AnyFeature";

const useCategorySynonymCache = () => {
  const appToken = useCurrentAppToken();
  const env = useEnvContext();
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
