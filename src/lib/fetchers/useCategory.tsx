import * as React from 'react';
import { getCategoryForFeature } from '../model/ac/categories/Categories';
import { AnyFeature } from '../model/geo/AnyFeature';
import { useCategorySynonymCache } from './fetchAccessibilityCloudCategories';

export default function useCategory(feature: AnyFeature) {
  const categorySynonymCache = useCategorySynonymCache();
  const category = React.useMemo(
    () => categorySynonymCache.data
        && feature
        && getCategoryForFeature(categorySynonymCache.data, feature),
    [categorySynonymCache.data, feature],
  );

  return { categorySynonymCache, category };
}
