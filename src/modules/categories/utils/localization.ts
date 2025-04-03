import type { ACCategory } from "~/modules/categories/types/ACCategory";

import {
  type Translations,
  useTranslations,
} from "~/modules/i18n/hooks/useTranslations";

export function getLocalizableCategoryName(
  category: ACCategory,
): Translations | undefined {
  return category.translations?._id;
}

export function getLocalizedCategoryName(
  category: ACCategory | undefined | null,
) {
  if (!category) {
    return undefined;
  }

  const localizedString = getLocalizableCategoryName(category);
  if (!localizedString) {
    return undefined;
  }

  return useTranslations(localizedString);
}
