import type { YesNoLimitedUnknown } from "~/needs-refactoring/lib/model/ac/Feature";
import { FullyWheelchairAccessibleIcon } from "~/components/icons/mobility/FullyWheelchairAccessibleIcon";
import { PartiallyWheelchairAccessibleIcon } from "~/components/icons/mobility/PartiallyWheelchairAccessibleIcon";
import { NotWheelchairAccessibleIcon } from "~/components/icons/mobility/NotWheelchairAccessibleIcon";
import { NoDataIcon } from "~/components/icons/mobility/NoDataIcon";

export function getAccessibilityIcon(accessibility: YesNoLimitedUnknown) {
  switch (accessibility) {
    case "yes":
      return FullyWheelchairAccessibleIcon;
    case "limited":
      return PartiallyWheelchairAccessibleIcon;
    case "no":
      return NotWheelchairAccessibleIcon;
    case "unknown":
      return NoDataIcon;
    default:
      return null;
  }
}
