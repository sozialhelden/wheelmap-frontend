import type { SVGAttributes } from "react";
import AccessibleIconMarkerBase from "./AccessibleIconMarkerBase";
import type { Category } from "~/modules/categories/categories";
import {
  grass,
  orange,
  ruby,
  gray,
  grassDark,
  orangeDark,
  rubyDark,
  grayDark,
} from "@radix-ui/colors";

// This component is used by cli scripts to render the icon marker in the
// correct colors as we cannot use CSS variables in a non-Browser context.
// These icons rendered on the command line are then uploaded to Mapbox
// Studio in order to use them there when working on the map style.
// Also see: docs/contributing/05.map-styles.md
export default function AccessibleIconMarkerServer(
  props: SVGAttributes<SVGElement> & {
    accessibilityGrade: string;
    category: Category;
    darkMode: boolean;
  },
) {
  const { darkMode, ...markerProps } = props;

  const backgroundColor =
    {
      good: (darkMode ? grassDark : grass).grass9,
      mediocre: (darkMode ? orangeDark : orange).orange9,
      bad: (darkMode ? rubyDark : ruby).ruby9,
      unknown: (darkMode ? grayDark : gray).gray9,
    }[props.accessibilityGrade] || "#000";

  const foregroundColor = darkMode ? "#000" : "#fff";

  return (
    <AccessibleIconMarkerBase
      {...markerProps}
      foregroundColor={foregroundColor}
      backgroundColor={backgroundColor}
      hasShadow={true}
      hasHalo={true}
    />
  );
}
