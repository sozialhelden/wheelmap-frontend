import { EquipmentInfo } from '../../../lib/EquipmentInfo';
import { LocalizedString, translatedStringFromObject } from '../../../lib/i18n';

export default function getEquipmentInfoDescription(
  equipmentInfo: EquipmentInfo | null | undefined,
  variant: 'shortDescription' | 'longDescription' | 'description'
) {
  if (!equipmentInfo || !equipmentInfo.properties) {
    return;
  }

  const variantsToTry = [variant, 'shortDescription', 'description', 'longDescription'];
  let description: LocalizedString | undefined = undefined;
  for (const variant of variantsToTry) {
    const d = equipmentInfo.properties?.[variant];
    if (d) {
      description = d;
      break;
    }
  }

  return description && translatedStringFromObject(description);
}
