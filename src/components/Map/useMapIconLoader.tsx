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

function getFinalIconName(
  iconName: string,
  options: { suffix?: string } = {},
): string {
  return `${iconName}${options?.suffix ?? ""}`;
}

function renderIconComponents(
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

function applyIconTransformations(
  svgElement: SVGSVGElement,
  options: { fill?: string; addShadow?: boolean; iconSize?: number } = {},
): void {
  svgElement.setAttribute("width", "60");
  svgElement.setAttribute("height", "60");

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

function createSvgDataUrl(div: HTMLDivElement): string {
  const svg = div.innerHTML;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function loadImageFromDataURL(
  map: MapBoxMap,
  finalIconName: string,
  dataUrl: string,
  wasInCache: boolean,
): void {
  const image = new Image(60, 60);

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
  const finalIconName = getFinalIconName(iconName, options);

  if (map.hasImage(finalIconName)) {
    return;
  }

  let dataUrl = renderCache.get(finalIconName);
  const wasInCache = !!dataUrl;

  if (!dataUrl) {
    const renderResult = renderIconComponents(icons, iconName, finalIconName);
    if (!renderResult) return;

    const { svgElement, containerElement: div, reactRoot: root } = renderResult;
    applyIconTransformations(svgElement, options);
    dataUrl = createSvgDataUrl(div);
    renderCache.set(finalIconName, dataUrl);
    root.unmount();
    div.innerHTML = "";
  }

  const existingImage = imageCache.get(finalIconName);
  if (existingImage) {
    map.addImage(finalIconName, existingImage, { pixelRatio: 4 });
    return;
  }
  loadImageFromDataURL(map, finalIconName, dataUrl, wasInCache);
}

export function loadIconsInMapInstance(mapInstance: MapBoxMap): void {
  for (const iconName of Object.keys(categoryIcons)) {
    for (const accessibilityGrade of ["yes", "no", "limited"]) {
      loadIcon(mapInstance, categoryIcons, iconName, {
        fill: "white",
        addShadow: true,
        suffix: `-${accessibilityGrade}`,
      });
    }
    loadIcon(mapInstance, categoryIcons, iconName, {
      fill: "#666",
      addShadow: true,
      suffix: "-unknown",
      iconSize: 0.8,
    });
  }

  for (const iconName of Object.keys(markerIcons)) {
    loadIcon(mapInstance, markerIcons, iconName, {
      fill: "black",
      addShadow: true,
      suffix: "",
    });
  }
}
