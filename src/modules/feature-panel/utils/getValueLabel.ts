import { useTranslations } from "~/modules/i18n/hooks/useTranslations";
import type { TagOrTagGroup } from "~/modules/feature-panel/hooks/useOsmTags";

/*
 * Checks the tag properties for a localized short label. If none is defined it falls back to the value element.
 * If this is neither a string nor a number it falls back to the raw value and otherwise an empty string.
 */

export function getValueLabel(tag: TagOrTagGroup) {
  return (
    useTranslations(tag.tagProps?.valueAttribute?.shortLabel) ||
    (typeof tag.tagProps?.valueElement === "string" ||
    typeof tag.tagProps?.valueElement === "number"
      ? tag.tagProps.valueElement.toString()
      : "") ||
    tag.value ||
    ""
  );
}
