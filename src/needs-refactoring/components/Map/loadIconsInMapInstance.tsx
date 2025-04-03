import type { Map as MapBoxMap } from "mapbox-gl";
import type React from "react";
import { type FunctionComponent, useCallback } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import * as categoryIcons from "../../../components/icons/categories";
import * as markerIcons from "../../../components/icons/markers";
import ColoredIconMarker from "./ColoredIconMarker";

type IconMap = {
  [name: string]: FunctionComponent;
};

const renderCache = new Map<string, string>();
const imageCache = new Map<string, HTMLImageElement>();
const IconSize = 60;

function renderIconAsDataUrl(
  reactElement: React.ReactNode,
  styling: StylingProps,
): string | undefined {
  const containerElement = document.createElement("div");
  const reactRoot = createRoot(containerElement);

  // Without flushing, the icon component would render asynchronously.
  flushSync(() => {
    reactRoot.render(reactElement);
  });

  // Unmounts the component after rendering to avoid memory leaks.
  const unmount = () => {
    reactRoot.unmount();
    containerElement.innerHTML = "";
  };

  const svgElement = containerElement.querySelector("svg");
  if (!svgElement) {
    console.warn("Could not find svg element in icon", reactElement);
    unmount();
    return undefined;
  }

  // Ensure proper XML namespace
  svgElement.setAttributeNS(
    "http://www.w3.org/2000/xmlns/",
    "xmlns",
    "http://www.w3.org/2000/svg",
  );

  applyIconTransformationsAndFills({ svgElement, styling });
  const svgCode = containerElement.innerHTML;
  unmount?.();
  return `data:image/svg+xml;base64,${btoa(svgCode)}`;
}

type StylingProps = {
  fill?: string;
  addShadow?: boolean;
  iconSize?: number;
};

function applyIconTransformationsAndFills({
  svgElement,
  styling: { fill, addShadow, iconSize = 1.0 } = {},
}: {
  svgElement: SVGSVGElement;
  styling: StylingProps;
}): void {
  svgElement.setAttribute("width", IconSize.toString());
  svgElement.setAttribute("height", IconSize.toString());

  const iconElement = svgElement.querySelector("svg > svg");

  if (iconElement) {
    const translation = 4.5;
    iconElement.setAttribute("transform", `scale(${iconSize}, ${iconSize})`);
    iconElement.setAttribute("transform-origin", "center center");
    iconElement.setAttribute("x", `${translation}`);
    iconElement.setAttribute("y", `${translation}`);
    if (fill) {
      const filledElements = iconElement.querySelectorAll(
        "path, rect, circle, ellipse, line, polyline, polygon",
      );
      for (const e of filledElements) {
        e.setAttribute("fill", fill);
      }
    }
  }

  if (addShadow) {
    applyDropShadowFilter(svgElement);
  }
}

/**
 * Enhances icon contrast.
 */
function applyDropShadowFilter(svgElement: SVGSVGElement) {
  const graphicalElements = svgElement.querySelectorAll(
    "path, rect, circle, ellipse, line, polyline, polygon",
  );
  for (const e of graphicalElements) {
    e.setAttribute("filter", "url(#shadow)");
  }
  // Create and append the drop shadow filter definition
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const filter = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "filter",
  );
  filter.setAttribute("id", "shadow");
  const feDropShadow = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "feDropShadow",
  );
  feDropShadow.setAttribute("dx", "0");
  feDropShadow.setAttribute("dy", "0");
  feDropShadow.setAttribute("stdDeviation", "0.5");
  feDropShadow.setAttribute("flood-color", "black");
  feDropShadow.setAttribute("flood-opacity", "0.9");
  filter.appendChild(feDropShadow);
  defs.appendChild(filter);
  svgElement.appendChild(defs);
}

function loadImageFromDataURL(
  map: MapBoxMap,
  mapboxIconName: string,
  dataUrl: string,
  logErrors: boolean,
): void {
  const existingImage = imageCache.get(mapboxIconName);
  if (existingImage) {
    map.addImage(mapboxIconName, existingImage, { pixelRatio: 4 });
    return;
  }

  const image = new Image(IconSize, IconSize);

  image.onload = () => {
    imageCache.set(mapboxIconName, image);
    map.addImage(mapboxIconName, image, { pixelRatio: 4 });
  };

  image.onerror = (
    event: Event | string,
    source?: string,
    lineno?: number,
    colno?: number,
    error?: Error,
  ) => {
    if (logErrors) {
      console.error(`Could not load icon ${mapboxIconName}:`, error);
    }
  };

  image.src = dataUrl;
}

function loadIcon({
  map,
  element,
  mapboxIconName,
  styling,
}: {
  map: MapBoxMap;
  element: React.ReactNode;
  mapboxIconName: string;
  styling: StylingProps;
}): void {
  if (map.hasImage(mapboxIconName)) {
    return;
  }
  let dataUrl = renderCache.get(mapboxIconName);
  const wasInCache = !!dataUrl;
  if (!dataUrl) {
    dataUrl = renderIconAsDataUrl(element, styling);
  }
  if (!dataUrl) {
    return;
  }
  renderCache.set(mapboxIconName, dataUrl);
  loadImageFromDataURL(map, mapboxIconName, dataUrl, !wasInCache);
}

async function processTasksInBatches(tasks: (() => void)[], batchSize: number) {
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    for (const task of batch) {
      task();
    }

    // Yield control to let the UI update. The `setTimeout()` call is necessary: Without
    // it, the following batch would be loaded in the same main loop iteration, which means the
    // browser would not get time for handling other events – the UI would get stuck. The
    // `setTimeout()` call means that processing the next the next happens asynchronously. This
    // way, the batch processing doesn't use **one**, but **multiple** JS main loop iterations.
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

/**
 * Load all icons in the map instance in batches (asynchronously).
 * Without batching, the loading would take too long. Synchonous loading would block the UI thread.
 */
export async function loadIconsInMapInstance(map: MapBoxMap): Promise<void> {
  const tasks: Array<() => void> = [];
  // Queue tasks for category icons.
  for (const accessibilityGrade of ["good", "mediocre", "bad", "unknown"]) {
    // Marker color originates from a CSS variable value like `var(--rating-good)`
    const style = getComputedStyle(document.documentElement);
    const foregroundColor = style.getPropertyValue(
      `--rating-${accessibilityGrade}-contrast`,
    );

    for (const [categoryIconName, IconComponent] of Object.entries(
      categoryIcons,
    )) {
      tasks.push(() => {
        loadIcon({
          map,
          mapboxIconName: `${categoryIconName}-${accessibilityGrade}`,
          element: (
            <ColoredIconMarker accessibilityGrade={accessibilityGrade}>
              <IconComponent />
            </ColoredIconMarker>
          ),
          styling: {
            fill: foregroundColor,
            iconSize: accessibilityGrade === "unknown" ? 0.8 : 1.0,
            addShadow: true,
          },
        });
      });
    }
  }

  // Queue tasks for marker icons.
  for (const [iconName, IconComponent] of Object.entries(markerIcons)) {
    tasks.push(() => {
      loadIcon({
        map,
        element: <IconComponent />,
        mapboxIconName: iconName,
        styling: {
          fill: "black",
          addShadow: true,
        },
      });
    });
  }

  await processTasksInBatches(tasks, 20);
}
