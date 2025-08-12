import type { TagOrTagGroup } from "~/modules/edit/hooks/useOsmTags";
import { useTranslations } from "~/modules/i18n/hooks/useTranslations";

// This is not ideal. In the future we should think of a uniform way to add emojis to the UI
export function maskEmojisForScreenReaders(text: string) {
  const r = /\p{Emoji_Presentation}/gu;
  return text.replace(r, (emoji) => `<span aria-hidden="true">${emoji}</span>`);
}

/*
 * Checks the tag properties for a localized short label. If none is defined it falls back to the value element.
 * If this is neither a string nor a number it falls back to the raw value and otherwise an empty string.
 */

export function getValueLabel(tag: TagOrTagGroup) {
  const valueLabel =
    useTranslations(tag.tagProps?.valueAttribute?.shortLabel) ||
    (typeof tag.tagProps?.valueElement === "string" ||
    typeof tag.tagProps?.valueElement === "number"
      ? tag.tagProps.valueElement.toString()
      : "") ||
    tag.value?.toString() ||
    "";
  return maskEmojisForScreenReaders(valueLabel);
}
