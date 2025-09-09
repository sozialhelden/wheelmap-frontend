import { useI18n } from "~/modules/i18n/hooks/useI18n";
import {
  type Translations,
  getTranslations,
} from "~/modules/i18n/utils/translations";

export function useTranslations(
  input: Translations | string | null | undefined,
): string | undefined {
  const { languageTag } = useI18n();
  return getTranslations(input, languageTag);
}
