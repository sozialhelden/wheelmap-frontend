import brightStyle from "~/modules/map/styles/bright.json";
import darkStyle from "~/modules/map/styles/dark.json";
import type { StyleSpecification } from "mapbox-gl";

import {
  isAccessibilityCloudLayer,
  isOsmApiLayer,
} from "~/modules/map/utils/layers";

export const getStyle = (dark: boolean): StyleSpecification => {
  return {
    ...(dark ? darkStyle : brightStyle),
  } as unknown as StyleSpecification;
};

export function getBaseStyle(dark: boolean): StyleSpecification {
  const { sprite, ...style } = getStyle(dark);
  style.layers = style.layers.filter(
    (layer) => !isOsmApiLayer(layer) && !isAccessibilityCloudLayer(layer),
  );
  return style;
}
