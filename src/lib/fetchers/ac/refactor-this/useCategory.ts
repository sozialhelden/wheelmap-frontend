import * as React from 'react'
import { getCategoryForFeature, unknownCategory } from '../../../model/ac/categories/Categories'
import { AnyFeature } from '../../../model/geo/AnyFeature'
import { useCategorySynonymCache } from './fetchAccessibilityCloudCategories'

export default function useCategory(...features: (AnyFeature | null | undefined)[]) {
  const categorySynonymCache = useCategorySynonymCache()
  const category = React.useMemo(
    () => {
      if (!categorySynonymCache.data) {
        return unknownCategory
      }

      for (const feature of features) {
        if (!feature) {
          continue
        }

        const result = getCategoryForFeature(categorySynonymCache.data, feature)
        if (result && result !== unknownCategory) {
          return result
        }
      }

      return unknownCategory
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categorySynonymCache.data, ...features],
  )

  return { categorySynonymCache, category }
}
