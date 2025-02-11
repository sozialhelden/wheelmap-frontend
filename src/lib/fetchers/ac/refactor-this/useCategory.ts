import * as React from 'react'
import { AnyFeature } from '../../../model/geo/AnyFeature'
import { useCategorySynonymCache } from './fetchAccessibilityCloudCategories'
import {getCategoryForFeature, unknownCategory} from "~/domains/categories/functions/cache";

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
