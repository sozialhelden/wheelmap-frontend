import type { EquipmentInfo } from "@sozialhelden/a11yjson";
import {
  type Translations,
  useTranslations,
} from "../../../modules/i18n/hooks/useTranslations";

export default function useEquipmentInfoDescription(
  equipmentInfo: EquipmentInfo | null | undefined,
  variant: "shortDescription" | "longDescription" | "description",
) {
  if (!equipmentInfo) {
    return;
  }

  const variantsToTry = [
    variant,
    "shortDescription",
    "description",
    "longDescription",
  ];
  let description: Translations | undefined;
  for (const variant of variantsToTry) {
    const d = equipmentInfo.properties?.[variant];
    if (d) {
      description = d;
      break;
    }
  }
  return description && useTranslations(description);
}
