import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import type { MapIcon } from "~/modules/map/icons";
import AccessibleIconMarker from "~/modules/map/components/AccessibleIconMarker";

export const getIconComponent = (
  icon: MapIcon,
  darkMode: boolean,
): ReactNode => {
  if (icon.type === "default") {
    return darkMode && icon.componentDarkMode
      ? icon.componentDarkMode
      : icon.component;
  }
  if (icon.type === "category") {
    const { type, ...properties } = icon;
    return <AccessibleIconMarker darkMode={darkMode} {...properties} />;
  }
  throw new Error(`Unknown icon type: ${(icon as MapIcon).type}`);
};

function renderReactNode(reactNode: ReactNode) {
  const container = document.createElement("div");
  const reactRoot = createRoot(container);

  // Without flushing, the icon component would render asynchronously.
  flushSync(() => {
    reactRoot.render(reactNode);
  });

  // Unmounts the component after rendering to avoid memory leaks.
  const unmount = () => {
    reactRoot.unmount();
    container.innerHTML = "";
  };

  const html = container.innerHTML;
  return { html, unmount };
}

export function renderSvgAsDataUri(reactElement: ReactNode): string {
  const { html, unmount } = renderReactNode(reactElement);

  const base64String = btoa(html);
  unmount?.();

  return `data:image/svg+xml;base64,${base64String}`;
}
