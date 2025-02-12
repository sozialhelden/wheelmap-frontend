import type { Map as MapBoxMap } from "mapbox-gl";
import { type FunctionComponent, useCallback } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import * as categoryIcons from "../icons/categories";
import * as markerIcons from "../icons/markers";
import ColoredIconMarker from "./ColoredIconMarker";

type IconMap = {
  [name: string]: FunctionComponent;
};

const renderCache = new Map<string, string>();
const imageCache = new Map<string, HTMLImageElement>();
const IconSize = 60;

function renderIconReactComponents(
  icons: IconMap,
  iconName: string,
  finalIconName: string,
): {
  svgElement: SVGSVGElement;
  containerElement: HTMLDivElement;
  reactRoot: ReturnType<typeof createRoot>;
} | null {
  const containerElement = document.createElement("div");
  const reactRoot = createRoot(containerElement);

  // Without flushing, the icon component would render asynchronously.
  flushSync(() => {
    const [categoryIconName, accessibilityGrade] = finalIconName.split("-");
    const IconComponent =
      categoryIconName && accessibilityGrade
        ? icons[categoryIconName]
        : icons[iconName];
    const element = accessibilityGrade ? (
      <ColoredIconMarker accessibilityGrade={accessibilityGrade}>
        <IconComponent />
      </ColoredIconMarker>
    ) : (
      <IconComponent />
    );
    reactRoot.render(element);
  });

  const svgElement = containerElement.querySelector("svg");
  if (!svgElement) {
    console.warn("Could not find svg element in icon", finalIconName);
    reactRoot.unmount();
    return null;
  }

  // Ensure proper XML namespace
  svgElement.setAttributeNS(
    "http://www.w3.org/2000/xmlns/",
    "xmlns",
    "http://www.w3.org/2000/svg",
  );
  return { svgElement, containerElement, reactRoot };
}

function applyIconTransformationsAndFills(
  svgElement: SVGSVGElement,
  options: { fill?: string; addShadow?: boolean; iconSize?: number } = {},
): void {
  svgElement.setAttribute("width", IconSize.toString());
  svgElement.setAttribute("height", IconSize.toString());

  const iconElement = svgElement.querySelector("svg > svg");
  const iconSize = options.iconSize || 1.0;
  if (iconElement) {
    const translation = 4.5;
    iconElement.setAttribute("transform", `scale(${iconSize}, ${iconSize})`);
    iconElement.setAttribute("transform-origin", "center center");
    iconElement.setAttribute("x", `${translation}`);
    iconElement.setAttribute("y", `${translation}`);
    if (options.fill) {
      const filledElements = iconElement.querySelectorAll(
        "path, rect, circle, ellipse, line, polyline, polygon",
      );
      for (const e of filledElements) {
        e.setAttribute("fill", options.fill);
      }
    }
  }

  if (options.addShadow) {
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
  // Create and append the shadow filter definition
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

function createSVGDataUrl(div: HTMLDivElement): string {
  const svg = div.innerHTML;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function loadImageFromDataURL(
  map: MapBoxMap,
  finalIconName: string,
  dataUrl: string,
  wasInCache: boolean,
): void {
  const existingImage = imageCache.get(finalIconName);
  if (existingImage) {
    map.addImage(finalIconName, existingImage, { pixelRatio: 4 });
    return;
  }

  const image = new Image(IconSize, IconSize);

  image.onload = () => {
    imageCache.set(finalIconName, image);
    map.addImage(finalIconName, image, { pixelRatio: 4 });
  };

  image.onerror = () => {
    if (!wasInCache) {
      console.log("error loading icon", finalIconName, dataUrl);
    }
  };

  image.src = dataUrl;
}

function loadIcon(
  map: MapBoxMap,
  icons: IconMap,
  iconName: string,
  options: {
    fill?: string;
    addShadow?: boolean;
    suffix?: string;
    iconSize?: number;
  } = {},
): void {
  const finalIconName = `${iconName}${options?.suffix ?? ""}`;

  if (map.hasImage(finalIconName)) {
    return;
  }

  let dataUrl = renderCache.get(finalIconName);
  const wasInCache = !!dataUrl;

  if (!dataUrl) {
    const renderResult = renderIconReactComponents(
      icons,
      iconName,
      finalIconName,
    );
    if (!renderResult) return;

    const { svgElement, containerElement: div, reactRoot: root } = renderResult;
    applyIconTransformationsAndFills(svgElement, options);
    dataUrl = createSVGDataUrl(div);
    renderCache.set(finalIconName, dataUrl);
    root.unmount();
    div.innerHTML = "";
  }

  loadImageFromDataURL(map, finalIconName, dataUrl, wasInCache);
}

/**
 * Load all icons in the map instance in batches (asynchronously).
 * Without batching, the loading would take too long. Synchonous loading would block the UI thread.
 */
export async function loadIconsInMapInstance(
  mapInstance: MapBoxMap,
): Promise<void> {
  const tasks: Array<() => void> = [];

  // Queue tasks for category icons.
  for (const iconName of Object.keys(categoryIcons)) {
    for (const accessibilityGrade of ["yes", "no", "limited"]) {
      tasks.push(() => {
        loadIcon(mapInstance, categoryIcons, iconName, {
          fill: "white",
          addShadow: true,
          suffix: `-${accessibilityGrade}`,
        });
      });
    }
    tasks.push(() => {
      loadIcon(mapInstance, categoryIcons, iconName, {
        fill: "#666",
        addShadow: true,
        suffix: "-unknown",
        iconSize: 0.8,
      });
    });
  }

  // Queue tasks for marker icons.
  for (const iconName of Object.keys(markerIcons)) {
    tasks.push(() => {
      loadIcon(mapInstance, markerIcons, iconName, {
        fill: "black",
        addShadow: true,
        suffix: "",
      });
    });
  }

  // Process tasks in batches of 20.
  const batchSize = 20;
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    for (const task of batch) {
      task();
    }
    // Yield control to let the UI update.
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}
