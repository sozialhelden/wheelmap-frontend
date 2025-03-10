import type { EquipmentInfo } from "@sozialhelden/a11yjson";
import type { LocalizedString } from "../../../lib/i18n/LocalizedString";
import { useTranslatedStringFromObject } from "../../../lib/i18n/useTranslatedStringFromObject";

export default function getEquipmentInfoDescription(
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
  let description: LocalizedString | undefined;
  for (const variant of variantsToTry) {
    const d = equipmentInfo.properties?.[variant];
    if (d) {
      description = d;
      break;
    }
  }
  return description && useTranslatedStringFromObject(description);
}
