import type { ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { index, type MapIcon } from "../../src/modules/map/icons";
import AccessibleIconMarkerServer from "../../src/modules/map/components/AccessibleIconMarkerServer";

const getIconComponent = (icon: MapIcon, darkMode: boolean): ReactNode => {
  if (icon.type === "default") {
    return icon.component;
  }
  if (icon.type === "category") {
    const { type, ...properties } = icon;
    return <AccessibleIconMarkerServer {...properties} darkMode={darkMode} />;
  }
  throw new Error(`Unknown icon type: ${(icon as MapIcon).type}`);
};

export function renderIcons(darkMode: boolean) {
  return Object.entries(index).map(([identifier, icon]) => ({
    html: renderToString(getIconComponent(icon, darkMode)),
    identifier,
  }));
}
