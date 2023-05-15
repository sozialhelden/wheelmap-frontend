import * as React from "react";
import { useCurrentAppToken } from "../context/AppContext";
import { getCategoryForFeature } from "../model/ac/categories/Categories";
import { AnyFeature } from "../model/shared/AnyFeature";
import { useCategorySynonymCache } from "./fetchAccessibilityCloudCategories";

export default function useCategory(feature: AnyFeature) {
  const appToken = useCurrentAppToken();
  const categorySynonymCache = useCategorySynonymCache(appToken);
  const category = React.useMemo(
    () =>
      categorySynonymCache.data &&
      feature &&
      getCategoryForFeature(categorySynonymCache.data, feature),
    [categorySynonymCache.data, feature]
  );
  return { categorySynonymCache, category };
}
