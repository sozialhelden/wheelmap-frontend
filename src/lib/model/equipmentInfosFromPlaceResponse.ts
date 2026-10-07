import type { EquipmentInfo } from '../EquipmentInfo';

// The accessibility.cloud API returns a place's equipment (elevators, escalators…) as `related`
// documents when requested with `includeRelated=equipmentInfos`.
export function equipmentInfosFromPlaceResponse(responseJson: any): EquipmentInfo[] {
  const equipmentInfos = responseJson?.related?.equipmentInfos;
  if (!equipmentInfos || typeof equipmentInfos !== 'object') {
    return [];
  }
  return Object.values(equipmentInfos) as EquipmentInfo[];
}

export function getEquipmentInfoId(equipmentInfo: EquipmentInfo | any): string | undefined {
  return equipmentInfo?.properties?._id || equipmentInfo?._id;
}

// Don't link an equipment to itself if it's the only one at this place.
export function shouldListEquipmentInfos(
  equipmentInfos: EquipmentInfo[] | null | undefined,
  equipmentInfoId: string | null | undefined
): boolean {
  if (!equipmentInfos || equipmentInfos.length === 0) {
    return false;
  }
  if (equipmentInfos.length === 1 && getEquipmentInfoId(equipmentInfos[0]) === equipmentInfoId) {
    return false;
  }
  return true;
}
