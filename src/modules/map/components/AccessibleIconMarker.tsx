import type { SVGAttributes } from "react";
import AccessibleIconMarkerBase from "./AccessibleIconMarkerBase";
import type { Category } from "@sozialhelden/core";
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

export default function AccessibleIconMarker(
  props: SVGAttributes<SVGElement> & {
    accessibilityGrade: string;
    category: Category;
    shadow?: boolean;
    darkMode?: boolean;
  },
) {
  const { shadow, darkMode, ...markerProps } = props;

  // Instead of css variables, this uses the radix colors directly
  // in order to also work in a non-browser environment. We want to
  // use Mapbox Studio to edit map styles, and thus we need to upload
  // the icons as SVG strings to Mapbox Studio as part of our map style
  // workflow. Also see: /docs/contributing/05.map-styles.md
  const backgroundColor =
    {
      good: (darkMode ? grassDark : grass).grass9,
      mediocre: (darkMode ? orangeDark : orange).orange9,
      bad: (darkMode ? rubyDark : ruby).ruby9,
      unknown: (darkMode ? grayDark : gray).gray9,
    }[props.accessibilityGrade] || "#000";

  const foregroundColor = darkMode ? "#000" : "#fff";
  const shadowColor = darkMode ? "#fff" : "#000";
  const haloColor = darkMode ? "#000" : "#fff";

  const hasShadow = shadow || shadow === undefined;

  return (
    <AccessibleIconMarkerBase
      {...markerProps}
      foregroundColor={foregroundColor}
      backgroundColor={backgroundColor}
      shadowColor={shadowColor}
      haloColor={haloColor}
      hasShadow={hasShadow}
      hasHalo={hasShadow}
    />
  );
}
