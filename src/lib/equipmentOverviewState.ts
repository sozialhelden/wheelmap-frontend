/** Places with up to this many facilities list them all right away. */
const maximalInitiallyListedEquipmentCount = 2;

/**
 * Disrupted facilities are always listed. The others are listed when there are only a few, or
 * after the user asked for all of them – so the expand button is only useful while some are hidden.
 */
export function getEquipmentOverviewState({
  equipmentCount,
  workingGroupCount,
  isExpandedByUser,
}: {
  equipmentCount: number;
  workingGroupCount: number;
  isExpandedByUser: boolean;
}) {
  const isExpanded = isExpandedByUser || equipmentCount <= maximalInitiallyListedEquipmentCount;
  return {
    isExpanded,
    showsAllEquipmentButton: !isExpanded && workingGroupCount > 0,
  };
}
