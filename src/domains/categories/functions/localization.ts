import type {ACCategory} from "~/domains/categories/types/ACCategory";
import {
    getLocalizedStringTranslationWithMultipleLocales
} from "~/lib/i18n/getLocalizedStringTranslationWithMultipleLocales";
import type {LocalizedString} from "~/lib/i18n/LocalizedString";

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
