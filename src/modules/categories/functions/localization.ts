import type { LocalizedString } from "~/lib/i18n/LocalizedString";
import { getLocalizedStringTranslationWithMultipleLocales } from "~/lib/i18n/getLocalizedStringTranslationWithMultipleLocales";
import type { ACCategory } from "~/modules/categories/types/ACCategory";

export function getLocalizableCategoryName(
  category: ACCategory,
): LocalizedString | undefined {
  return category.translations?._id;
}

export function getLocalizedCategoryName(
  category: ACCategory | undefined | null,
  requestedLanguageTags: string[],
) {
  if (!category) {
    return undefined;
  }

  const localizedString = getLocalizableCategoryName(category);
  if (!localizedString) {
    return undefined;
  }

  return getLocalizedStringTranslationWithMultipleLocales(
    localizedString,
    requestedLanguageTags,
  );
}
