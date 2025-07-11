import type { StyleSpecification } from "mapbox-gl";
import brightStyle from "~/modules/map/styles/bright.json";
import darkStyle from "~/modules/map/styles/dark.json";
import { hasExternalSource } from "./sources";

export const getStyle = (dark: boolean): StyleSpecification => {
  return {
    ...(dark ? darkStyle : brightStyle),
  } as unknown as StyleSpecification;
};

export function getBaseStyle(dark: boolean): StyleSpecification {
  const { sprite, ...style } = getStyle(dark);

  // layers with external sources will be added dynamically in the map component
  style.layers = style.layers.filter((layer) => !hasExternalSource(layer.id));

  return style;
}
