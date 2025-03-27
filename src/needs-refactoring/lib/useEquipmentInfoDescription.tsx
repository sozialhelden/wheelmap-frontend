import { useTranslations } from "~/modules/i18n/hooks/useTranslations";
import type { EquipmentInfo, LocalizedString } from "@sozialhelden/a11yjson";

export default function useEquipmentInfoDescription(
  equipmentInfo: EquipmentInfo | null | undefined,
  variant: "shortDescription" | "longDescription" | "description",
) {
  if (!equipmentInfo || !equipmentInfo.properties) {
    return;
  }

  const variantsToTry = [
    variant,
    "shortDescription",
    "description",
    "longDescription",
  ];
  let description: LocalizedString | undefined = undefined;
  for (const variant of variantsToTry) {
    const d = equipmentInfo.properties?.[variant];
    if (d) {
      description = d;
      break;
    }
  }

  return description && useTranslations(description);
}
