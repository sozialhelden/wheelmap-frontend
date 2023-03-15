import { ControlGroup } from "@blueprintjs/core";
import {
  accessibilityDescription
} from "../../../../../lib/model/accessibilityStrings";
import {
  AnyFeature,
  isOSMFeature,
  isPlaceInfo
} from "../../../../../lib/model/shared/AnyFeature";
import { isWheelchairAccessible } from "../../../../../lib/model/shared/isWheelchairAccessible";

export default function PlaceWheelchairAccessibility({ feature }: { feature?: AnyFeature }) {
  if (!feature || (!isOSMFeature(feature) && !isPlaceInfo(feature))) {
    return null;
  }
  const { properties } = feature || {};
  if (!properties) {
    return null;
  }

  const wheelchairAccessibility = isWheelchairAccessible(feature);
  return (
    <ControlGroup vertical>
      <header>accessibilityName(wheelchairAccessibility)</header>
      <footer className="accessibility-description">
        {accessibilityDescription(wheelchairAccessibility)}
      </footer>
    </ControlGroup>
  );
}